// Checkout.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { clearCart } from "./slices/cartSlice";

const stripePromise = loadStripe("pk_test_51SL0WCKVr55uZBWlWDYAsNFef10ZULkjdnuDHwmIChXjmVCHKaJU3rHnTZTOESepV841JQLXh13ql5BVo9qKw1wk00M2iJm8rl"); // Your Stripe publishable key

function Checkout() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.carts.items);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        if (totalPrice === 0) return;

        async function createPaymentIntent() {
            const response = await fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            const result = await response.json();
            setClientSecret(result.data?.createPaymentIntent?.clientSecret);
        }

        createPaymentIntent();
    }, [totalPrice]);

    const handleSuccess = () => {
        alert("✅ Payment successful!");
        dispatch(clearCart());
    };

    if (cartItems.length === 0) return <p>Your cart is empty 🛒</p>;
    if (!clientSecret) return <p>Loading payment details...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>💳 Checkout</h2>
            <p>Total: <strong>${totalPrice.toFixed(2)}</strong></p>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={async (paymentIntent) => {
                    try {
                        const userEmail = "customer@example.com"; // Replace with real user info if you have auth
                        const totalAmount = totalPrice;
                        const items = cartItems.map(item => ({
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price,
                        }));

                        // GraphQL mutation request
                        const response = await fetch("http://localhost:8080/graphql", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                query: `
                      mutation CreateOrder($userEmail: String!, $totalAmount: Float!, $items: [OrderItemInput!]!) {
                          createOrder(userEmail: $userEmail, totalAmount: $totalAmount, items: $items) {
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
                                variables: { userEmail, totalAmount, items },
                            }),
                        });

                        const result = await response.json();
                        console.log("✅ Order saved to backend:", result.data.createOrder);

                        alert("✅ Payment and Order saved successfully!");
                        dispatch(clearCart());
                        setClientSecret(null);
                    } catch (err) {
                        console.error("❌ Failed to create order:", err);
                        alert("Payment succeeded but failed to record order!");
                    }
                }} />
            </Elements>
        </div>
    );
}

export default Checkout;
