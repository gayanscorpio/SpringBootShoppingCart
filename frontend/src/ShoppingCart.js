import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "./slices/cartSlice";

function ShoppingCart() {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (cartItems.length === 0) {
        return <p>Your cart is empty 🛒</p>;
    }

    return (
        <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", maxWidth: "400px" }}>
            <h2>🛒 Shopping Cart</h2>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                        <strong>{item.name}</strong> - ${item.price.toFixed(2)}
                        <button
                            onClick={() => dispatch(removeItem(item.id))}
                            style={{ marginLeft: "10px", color: "red" }}
                        >
                            ❌ Remove
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Total: ${total.toFixed(2)}</h3>

            <button
                onClick={() => dispatch(clearCart())}
                style={{ background: "orange", color: "white", padding: "8px", border: "none", borderRadius: "5px" }}
            >
                Clear Cart
            </button>

            <button
                style={{ background: "green", color: "white", padding: "8px", border: "none", borderRadius: "5px", marginLeft: "10px" }}
            >
                Checkout
            </button>
        </div>
    );
}

export default ShoppingCart;
