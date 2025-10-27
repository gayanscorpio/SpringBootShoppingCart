// App.js
import React from "react";
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

// ✅ Small wrapper to protect routes
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* ✅ Navbar */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>🏠 Home</Link>
          <Link to="/cart" style={{ marginRight: "15px" }}>🛒 Cart</Link>
          <Link to="/checkout" style={{ marginRight: "15px" }}>💳 Checkout</Link>

          {token ? (
            <button onClick={handleLogout} style={{ marginLeft: "15px" }}>🚪 Logout</button>
          ) : (
            <>
              <Link to="/login" style={{ marginLeft: "15px" }}>🔑 Login</Link>
              <Link to="/register" style={{ marginLeft: "10px" }}>📝 Register</Link>
            </>
          )}
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
      </div>
    </Router>
  );
}

export default App;
