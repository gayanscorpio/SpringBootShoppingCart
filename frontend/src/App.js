import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import Wishlist from './Wishlist';
import { setWishlist } from "./slices/wishlistSlice";

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
  const [role, setRole] = useState(localStorage.getItem("role"));

  const dispatch = useDispatch();
  if (username) {
    const savedWishlist = localStorage.getItem(`wishlist_${username}`);
    if (savedWishlist) {
      dispatch(setWishlist(JSON.parse(savedWishlist)));
    }
  }

  // 👂 Listen for login/logout changes globally
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
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
          justifyContent: "space-between",
          padding: "12px 40px",
          background: "#f4f4f4",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Left side links */}
        <div style={{ display: "flex", gap: "20px", fontSize: "18px" }}>
          <Link to="/">🏠 Home</Link>
          <Link to="/cart">🛒 Cart</Link>
          <Link to="/wishlist">💾 Wishlist</Link>
          <Link to="/checkout">💳 Checkout</Link>
        </div>

        {/* Right side auth controls */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center", fontSize: "18px" }}>
          {token ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: "10px",
                }}
              >
                <span>👋 <strong>{username}</strong></span>
                <small
                  style={{
                    color: role === "Admin" ? "#d35400" : "#555",
                    fontStyle: "italic",
                    fontSize: "14px",
                  }}
                >
                  ({role})
                </small>
              </div>

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
        {/* 🏠 Home Page — shows content only when logged in */}
        <Route
          path="/"
          element={
            token ? (
              <>
                <h1>🛍️ Shopping App</h1>
                {role === "Admin" && <AddProduct />}
                <ProductList role={role} />
              </>
            ) : (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>🛒 Welcome to Our Shopping App</h1>
                <p>Discover great products! Please log in to start shopping.</p>
                <Link
                  to="/login"
                  style={{
                    padding: "10px 20px",
                    background: "#3498db",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    display: "inline-block",
                    marginTop: "20px",
                  }}
                >
                  🔑 Login to Continue
                </Link>
              </div>
            )
          }
        />

        {/* Protected Routes */}
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
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Auth & Payment */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payments/Success" element={<Success />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </Router>
  );
}

export default App;
