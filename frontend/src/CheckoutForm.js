// CheckoutForm.js
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function CheckoutForm({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement) },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <CardElement />
            <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                    background: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "10px",
                }}
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

export default CheckoutForm;
