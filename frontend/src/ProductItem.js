import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./slices/cartSlice";

function ProductItem({ product, onDelete }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        // add with quantity
        dispatch(addItem({ ...product, quantity: 1 }));
    };

    return (
        <li style={{ marginBottom: "10px" }}>
            <div>
                <strong>{product.name}</strong> - ${Number(product.price).toFixed(2)}
                <button
                    onClick={handleAddToCart}
                    style={{ marginLeft: "10px", background: "green", color: "white" }}
                >
                    🛒 Add to Cart
                </button>
            </div>

            {onDelete && (
                <button
                    onClick={() => onDelete(product.id)}
                    style={{ marginLeft: "10px", background: "red", color: "white" }}
                >
                    ❌ Delete
                </button>
            )}
        </li>
    );
}

export default ProductItem;
