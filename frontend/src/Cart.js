import React from "react";
//useSelector reads values from the Redux store.
//returns the dispatch function so you can send actions to the store.
import { useSelector, useDispatch } from "react-redux";

//Imports two Redux action creators from your cart slice: 
// removeItem (remove one product by id) and clearCart (empty the cart).
import { removeItem, clearCart } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
    //Gets the Redux dispatch function so the component can dispatch actions,
    // like removeItem or clearCart.
    const dispatch = useDispatch();

    //change routes (used later to go to the checkout page).
    const navigate = useNavigate();

    //useSelector - reads values from the Redux store - items
    const cartItems = useSelector((state) => state.carts.items);
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

    if (cartItems.length === 0) {
        return <p style={{ textAlign: "center" }}>Your cart is empty 🛒</p>;
    }

    //starts the main JSX returned by the component.
    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "8px",
                maxWidth: "420px",
                margin: "20px auto",
                background: "#fafafa",
            }}
        >
            <h2>🛒 Your Cart</h2>

            <ul>
                {cartItems.map((item, index) => (
                    <li key={index} /* Renders a list item for each product. */
                        style={{ marginBottom: "10px" }}>
                        <strong>{item.name}</strong> — ${item.price.toFixed(2)} × {item.quantity}
                        <button
                            onClick={() => dispatch(removeItem(item.id))} //{ type: "carts/removeItem",payload: item.id}
                            style={{
                                marginLeft: "10px",
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                            }}
                        >
                            ❌ Remove
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Total: ${total.toFixed(2)}</h3>

            <div style={{ marginTop: "10px" }}>
                <button
                    onClick={() => dispatch(clearCart())}
                    style={{
                        background: "orange",
                        color: "white",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    🧹 Clear Cart
                </button>

                <button
                    onClick={() => navigate("/checkout")}
                    style={{
                        background: "green",
                        color: "white",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        marginLeft: "10px",
                    }}
                >
                    💳 Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;
