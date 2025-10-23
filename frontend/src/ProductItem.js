import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
