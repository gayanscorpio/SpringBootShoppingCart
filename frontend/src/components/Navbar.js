// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    // This allows Navbar to react to login/logout changes
    useEffect(() => {
        const checkToken = () => {
            setToken(localStorage.getItem("token"));
            setUsername(localStorage.getItem("username"));
            setRole(localStorage.getItem("role")); // ✅ Update role as well
        };

        // Listen for storage changes (other tabs, etc.)
        window.addEventListener("storage", checkToken);

        // Listen for custom event from login/register pages
        window.addEventListener("authChange", checkToken);

        return () => {
            window.removeEventListener("storage", checkToken);
            window.removeEventListener("authChange", checkToken);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role"); // ✅ Clear role on logout

        // Notify other components Navbar should update
        window.dispatchEvent(new Event("authChange"));
        setToken(null);
        setUsername(null);
        setRole(null);
        navigate("/");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                background: "#f4f4f4",
                borderBottom: "1px solid #ddd",
            }}
        >
            <div style={{ display: "flex", gap: "15px" }}>
                <Link to="/">Products</Link>
                <Link to="/cart">Cart</Link>
                {token && <Link to="/checkout">Checkout</Link>}
            </div>

            {/* Right user info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {token ? (
                    <>
                        <div style={{ textAlign: "right" }}>
                            <span>👋 <strong>{username}</strong></span><br />
                            {role && (
                                <small style={{ fontStyle: "italic", color: "#666" }}>
                                    ({role})
                                </small>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "5px 10px",
                                background: "#e74c3c",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
