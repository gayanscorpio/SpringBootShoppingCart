// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import Cart from "./Cart";
import CheckoutPage from "./Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ import toastify CSS

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>🏠 Home</Link>
          <Link to="/cart" style={{ marginRight: "15px" }}>🛒 Cart</Link>
          <Link to="/checkout">💳 Checkout</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Shopping App</h1>
                <AddProduct />
                <ProductList />
              </>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        {/* ✅ Toast container — must be inside Router */}
        <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      </div>
    </Router>
  );
}

export default App;
