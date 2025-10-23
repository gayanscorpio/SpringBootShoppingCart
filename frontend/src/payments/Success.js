import React from "react";
import { Link } from "react-router-dom";

function Success() {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "40px",
                background: "#f0fff0",
                borderRadius: "10px",
                maxWidth: "500px",
                margin: "50px auto",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ color: "green" }}>✅ Payment Successful!</h2>
            <p>Thank you for your purchase. Your payment was processed successfully.</p>

            <Link
                to="/"
                style={{
                    background: "green",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    marginTop: "20px",
                    display: "inline-block",
                }}
            >
                🏠 Back to Home
            </Link>
        </div>
    );
}

export default Success;
