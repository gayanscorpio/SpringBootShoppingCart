import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToWishlist } from "./slices/wishlistSlice";

function ProductItem({ product, onDelete }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        // ✅ Add product to Redux cart
        dispatch(addItem({ ...product, quantity: 1 }));

        // ✅ Show confirmation toast
        toast.success(`${product.name} added to cart! 🛒`, {
            position: "top-right",
            autoClose: 1000,
        });

        // ✅ Navigate to cart after short delay (to let toast show)
        setTimeout(() => {
            navigate("/cart");
        }, 1000);
    };

    // 💾 Save for Later (wishlist)
    const onSaveForLater = () => {
        dispatch(addToWishlist(product));
        toast.info(`${product.name} saved for later 💾`, {
            position: "top-right",
            autoClose: 1000,
        });
    };

    return (
        <li
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
            }}
        >
            <div>
                <strong>{product.name}</strong> — ${Number(product.price).toFixed(2)}
            </div>

            <div>
                <button
                    onClick={handleAddToCart}
                    style={{
                        marginLeft: "10px",
                        background: "green",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    🛒 Add to Cart
                </button>

                {/* ✅ Save for Later */}
                <button
                    onClick={() => onSaveForLater(product)}
                    style={{
                        padding: "6px 12px",
                        background: "#f39c12",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginLeft: "8px",
                    }}
                >
                    💾 Save for Later
                </button>

                {onDelete && (
                    <button
                        onClick={() => onDelete(product.id)}
                        style={{
                            marginLeft: "10px",
                            background: "red",
                            color: "white",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        ❌ Delete
                    </button>
                )}
            </div>
        </li>
    );
}

export default ProductItem;
