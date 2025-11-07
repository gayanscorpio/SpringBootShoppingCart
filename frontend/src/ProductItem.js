import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToWishlist } from "./slices/wishlistSlice";

function ProductItem({ product, isAdultRestricted, userAge, onDelete }) {
    console.log("Products:", product);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const restricted = isAdultRestricted && userAge < 18;

    const handleAddToCart = () => {
        //check if restricted product for that user
        if (restricted) {
            toast.error("You must be 18+ to buy this product 🔞", {
                position: "top-right",
                autoClose: 1500,
            });
            return;
        }

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
    const handleSaveForLater = () => {
        if (restricted) {
            toast.warn("Restricted product cannot be saved 💾", {
                position: "top-right",
                autoClose: 1500,
            });
            return;
        }

        dispatch(addToWishlist(product));
        toast.info(`${product.name} saved for later 💾`, {
            position: "top-right",
            autoClose: 1000,
        });
    };
    console.log("Product:", product.name, "User age:", userAge, "Restricted:", restricted);

    return (
        <li
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                opacity: restricted ? 0.6 : 1,
            }}
        >
            <div>
                <strong>
                    {restricted ? "+18 Product (Restricted)" : product.name}
                </strong>
                {!restricted && <> — ${Number(product.price).toFixed(2)}</>}
            </div>

            <div>
                {!restricted ? (
                    <>
                        <button
                            onClick={() => handleAddToCart(product)}
                            style={{
                                marginLeft: "10px",
                                background: restricted ? "gray" : "green",
                                color: "white",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "5px",
                                cursor: restricted ? "not-allowed" : "pointer",
                            }}
                            disabled={restricted}
                        >
                            🛒 Add to Cart
                        </button>

                        {/* ✅ Save for Later */}
                        <button
                            onClick={handleSaveForLater}
                            style={{
                                padding: "6px 12px",
                                background: restricted ? "gray" : "#f39c12",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: restricted ? "not-allowed" : "pointer",
                                marginLeft: "8px",
                            }}
                            disabled={restricted}
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
                    </>
                ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                        🔞 Restricted
                    </span>
                )}
            </div>
        </li>
    );
}

export default ProductItem;
