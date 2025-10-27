import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Success() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    const handleHome = () => {
        navigate("/");
    };

    if (!order) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Order not found</h2>
                <button onClick={handleHome}>🏠 Go Home</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>✅ Payment Successful!</h2>
            <p>Order ID: <strong>{order.id}</strong></p>
            <p>User: <strong>{order.userEmail}</strong></p>
            <p>Total Amount: <strong>${order.totalAmount.toFixed(2)}</strong></p>
            <h3>Items:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {order.items.map((item, index) => (
                    <li key={index}>
                        {item.productName} - {item.quantity} × ${Number(item.price).toFixed(2)}
                    </li>
                ))}
            </ul>
            <button
                onClick={handleHome}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                🏠 Back to Home
            </button>
        </div>
    );
}

export default Success;
