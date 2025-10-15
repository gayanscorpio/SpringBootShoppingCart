import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "./slices/cartSlice";

function Cart() {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.carts.items);

    const totalPrice = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    );

    return (
        <div style={{ border: "1px solid #ddd", padding: "15px", marginTop: "20px" }}>
            <h2>🛒 Shopping Cart</h2>

            {items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    <ul>
                        {items.map((item) => (
                            <li key={item.id} style={{ marginBottom: "10px" }}>
                                {item.name} — ${item.price} × {item.quantity}
                                <button
                                    onClick={() => dispatch(removeItem(item.id))}
                                    style={{ marginLeft: "10px", background: "red", color: "white" }}
                                >
                                    ❌ Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3>Total: ${totalPrice.toFixed(2)}</h3>
                    <button
                        onClick={() => dispatch(clearCart())}
                        style={{ marginTop: "10px", background: "orange", color: "white" }}
                    >
                        🧹 Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;