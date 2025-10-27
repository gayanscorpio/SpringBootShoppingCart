// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav style={{ padding: "10px", background: "#eee" }}>
            <Link to="/">Products</Link> | <Link to="/cart">Cart</Link> |{" "}
            {token ? (
                <>
                    <Link to="/checkout">Checkout</Link> |{" "}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
