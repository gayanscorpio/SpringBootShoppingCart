import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { clearCart } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";

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

    const [clientSecret, setClientSecret] = useState(null);
    // 🧠 Get token from localStorage
    const token = localStorage.getItem("token");

    // Create Stripe PaymentIntent
    useEffect(() => {
        if (totalPrice === 0) return;

        const createPaymentIntent = async () => {
            try {
                const response = await fetch("http://localhost:8080/graphql", {
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
                    }`,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }
                const result = await response.json();
                if (result.errors) {
                    console.error("GraphQL errors:", result.errors);
                    throw new Error(result.errors[0]?.message || "GraphQL error");
                }
                setClientSecret(result.data?.createPaymentIntent?.clientSecret);
            } catch (err) {
                console.error("❌ Failed to create payment intent:", err);
                alert("Failed to start checkout — please log in again.");
            }
        };

        createPaymentIntent();
    }, [totalPrice, token]);

    // Handle successful payment
    const handleSuccess = async (paymentIntent) => {
        try {
            const username = localStorage.getItem("username");
            const orderItems = items.map((item) => ({
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            // GraphQL createOrder mutation
            const response = await fetch("http://localhost:8080/graphql", {
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

            console.log("✅ Order saved:", order);

            dispatch(clearCart());
            setClientSecret(null);

            // Navigate to Success page with order details
            navigate("/payments/Success", { state: { order } });
        } catch (err) {
            console.error("❌ Failed to create order:", err);
            alert("Payment succeeded but failed to save order!");
        }
    };

    if (items.length === 0) return <p>Your cart is empty 🛒</p>;
    if (!clientSecret) return <p>Loading payment details...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>💳 Checkout</h2>
            <p>
                Total: <strong>${totalPrice.toFixed(2)}</strong>
            </p>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
            </Elements>
        </div>
    );
}

export default Checkout;
