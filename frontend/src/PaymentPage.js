import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useSelector } from "react-redux";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // ✅ your Stripe Publishable key (NOT secret)

function PaymentPage() {
    const [clientSecret, setClientSecret] = useState(null);
    const items = useSelector((state) => state.carts.items);

    const totalPrice = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    useEffect(() => {
        // ✅ Call your backend GraphQL mutation to create a PaymentIntent
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
            const secret = result.data?.createPaymentIntent?.clientSecret;
            setClientSecret(secret);
        }

        if (totalPrice > 0) createPaymentIntent();
    }, [totalPrice]);

    const handleSuccess = (paymentIntent) => {
        alert("✅ Payment successful! ID: " + paymentIntent.id);
    };

    if (!clientSecret) {
        return <p>Loading payment details...</p>;
    }

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

export default PaymentPage;
