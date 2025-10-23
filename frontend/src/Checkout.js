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
    const items = useSelector((state) => state.carts.items);
    const totalPrice = items.reduce(
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

    if (items.length === 0) return <p>Your cart is empty 🛒</p>;
    if (!clientSecret) return <p>Loading payment details...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>💳 Checkout</h2>
            <p>Total: <strong>${totalPrice.toFixed(2)}</strong></p>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
            </Elements>
        </div>
    );
}

export default Checkout;
