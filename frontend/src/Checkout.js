import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { clearCart } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";
import EnterPinModal from "./pin/EnterPinModal";
import { CHECK_USER_PIN } from "./graphql/pinQueries";
import { useLazyQuery } from '@apollo/client/react';
import SetPinForm from "./pin/SetPinForm";
import ResetPinForm from './pin/RestPinForm'

const stripePromise = loadStripe(
    "pk_test_51SL0WCKVr55uZBWlWDYAsNFef10ZULkjdnuDHwmIChXjmVCHKaJU3rHnTZTOESepV841JQLXh13ql5BVo9qKw1wk00M2iJm8rl"
);

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items = useSelector((state) => state.carts.items);
    const totalPrice = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const hasAdultItems = items.some((item) => item.isAdult);

    const [showSetPin, setShowSetPin] = useState(false);
    const [showEnterPin, setShowEnterPin] = useState(false);
    const [showResetPin, setShowResetPin] = useState(false);
    const [pinVerified, setPinVerified] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);

    // 🔍 Apollo Lazy Query
    const [checkUserPin] = useLazyQuery(CHECK_USER_PIN, {
        fetchPolicy: "network-only",
    });

    console.log("Checkout — userId:", userId);

    // 🔐 Step 1: Before doing PaymentIntent, check PIN when adult items exist
    useEffect(() => {
        if (!hasAdultItems) {
            setPinVerified(true);
            return;
        }

        // 🚫 Prevent PIN recheck when user is:
        // - resetting PIN
        // - currently entering PIN
        // - currently setting PIN
        if (showResetPin || showEnterPin || showSetPin) return;

        (async () => {
            try {
                const { data } = await checkUserPin({ variables: { userId } });

                const pinStatus = data?.checkUserPin;;
                console.log("PIN Status:", pinStatus);

                if (pinStatus?.hasPin === false) {
                    console.log('New user → create PIN');
                    setShowSetPin(true);
                } else {
                    // Existing user → enter PIN
                    setShowEnterPin(true);
                }
            } catch (err) {
                console.error("Error checking PIN:", err);
            }
        })();
    }, [hasAdultItems, userId, checkUserPin, showResetPin, showEnterPin, showSetPin]);

    // 💳 Step 2: Create Stripe Payment Intent AFTER pinVerified
    useEffect(() => {
        if (totalPrice === 0) return;
        if (hasAdultItems && !pinVerified) return;

        const createPaymentIntent = async () => {
            try {
                const response = await fetch("http://localhost:8081/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify({
                        query: `
                            mutation {
                                createPaymentIntent(amount: ${Math.round(totalPrice * 100)}) {
                                    clientSecret
                                }
                            }
                        `,
                    }),
                });

                const data = await response.json();
                setClientSecret(data.data?.createPaymentIntent?.clientSecret);
            } catch (error) {
                console.error("❌ PaymentIntent error:", error);
                alert("Failed to start checkout. Please login again.");
            }
        };

        createPaymentIntent();
    }, [pinVerified, totalPrice, token, hasAdultItems]);

    if (items.length === 0) return <p>Your cart is empty 🛒</p>;

    // ------------------------------
    // Main Render
    // ------------------------------
    return (
        <div style={{ padding: "20px" }}>
            {/* PIN modals */}
            {!showResetPin && showSetPin && ( //If no PIN → showSetPin = true → SetPinForm appears
                <SetPinForm
                    userId={userId}
                    onSuccess={() => {
                        setShowSetPin(false);
                        setPinVerified(true);
                        setShowEnterPin(false);
                    }}
                    onClose={() => setShowSetPin(false)}
                />
            )}

            {!showResetPin && showEnterPin && ( //If PIN exists → showEnterPin = true → EnterPinForm appears
                <EnterPinModal
                    userId={userId}
                    onSuccess={() => {
                        setShowEnterPin(false);
                        setPinVerified(true); // marks PIN verified, then Stripe checkout can proceed

                    }}
                    onForgotPin={() => {
                        setShowEnterPin(false);
                        setShowResetPin(true);
                    }}
                    onClose={() => setShowEnterPin(false)}
                />
            )}

            {showResetPin && (
                <ResetPinForm
                    username={localStorage.getItem("username")}
                    onSuccess={() => {
                        setShowResetPin(false);
                        setShowEnterPin(true); // Back to entering new PIN
                    }}
                    onCancel={() => setShowResetPin(false)}
                />
            )}

            {/* Waiting for PIN message */}
            {!pinVerified && hasAdultItems && !showSetPin && !showEnterPin && !showResetPin && (
                <p>Waiting for PIN...</p>
            )}

            {/* Checkout content */}
            {pinVerified && (
                <>
                    <h2>💳 Checkout</h2>
                    <p>Total: <strong>${totalPrice.toFixed(2)}</strong></p>
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
                        </Elements>
                    ) : (
                        <p>Loading payment details...</p>
                    )}
                </>
            )}
        </div>
    );

    // ------------------------------
    // 🧾 Order Creation After Payment successful payment
    // ------------------------------
    async function handleSuccess(paymentIntent) {
        try {
            const username = localStorage.getItem("username");

            const orderItems = items.map((item) => ({
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            const response = await fetch("http://localhost:8081/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    query: `
                        mutation CreateOrder($username: String!, $totalAmount: Float!, $items: [OrderItemInput!]!) {
                            createOrder(userEmail: $username, totalAmount: $totalAmount, items: $items) {
                                id
                                userEmail
                                totalAmount
                                paymentStatus
                                items {
                                    productName
                                    quantity
                                    price
                                }
                            }
                        }
                    `,
                    variables: { username, totalAmount: totalPrice, items: orderItems },
                }),
            });

            const result = await response.json();
            const order = result.data.createOrder;

            dispatch(clearCart());
            setClientSecret(null);

            navigate("/payments/Success", { state: { order } });
        } catch (err) {
            console.error("❌ Failed to save order:", err);
            alert("Payment succeeded but order saving failed.");
        }
    }
}

export default Checkout;
