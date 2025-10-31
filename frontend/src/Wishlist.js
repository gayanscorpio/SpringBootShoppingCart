import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "./slices/wishlistSlice";
import { addItem } from "./slices/cartSlice";

function Wishlist() {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist.items || []);

    const moveToCart = (item) => {
        dispatch(addItem(item));
        dispatch(removeFromWishlist(item.id));
    };

    if (wishlist.length === 0) {
        return <p style={{ textAlign: "center" }}>💤 No items saved for later.</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>💾 Saved for Later</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {wishlist.map((item) => (
                    <li
                        key={item.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "8px",
                        }}
                    >
                        <span>{item.name}</span>
                        <div>
                            <button
                                onClick={() => moveToCart(item)}
                                style={{
                                    marginRight: "10px",
                                    background: "#27ae60",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                }}
                            >
                                🛒 Move to Cart
                            </button>
                            <button
                                onClick={() => dispatch(removeFromWishlist(item.id))}
                                style={{
                                    background: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                }}
                            >
                                ❌ Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Wishlist;
