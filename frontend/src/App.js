import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import Cart from "./Cart";
import CheckoutPage from "./Checkout";
import Login from "./login/LoginForm";
import Register from "./login/RegisterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./payments/Success";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // 👂 Listen for login/logout changes from anywhere in the app
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <Router>
      {/* ✅ Navbar */}
      <nav
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // keeps left and right sides apart
          padding: "12px 40px",
          background: "#f4f4f4",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Left side links */}
        <div style={{ display: "flex", gap: "20px", fontSize: "18px" }}>
          <Link to="/">🏠 Home</Link>
          <Link to="/cart">🛒 Cart</Link>
          <Link to="/checkout">💳 Checkout</Link>
        </div>

        {/* Right side auth controls */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center", fontSize: "18px" }}>
          {token ? (
            <>
              <span>👋 {username}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">🔑 Login</Link>
              <Link to="/register">📝 Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>🛍️ Shopping App</h1>
              <AddProduct />
              <ProductList />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payments/Success" element={<Success />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </Router>
  );
}

export default App;
