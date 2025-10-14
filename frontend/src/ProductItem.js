import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./slices/cartSlice";

function ProductItem({ product, onDelete }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addItem(product));
    };

    return (
        <li style={{ marginBottom: "10px" }}>
            {product.name} - ${product.price.toFixed(2)}

            <button
                onClick={handleAddToCart}
                style={{ marginLeft: "10px", background: "green", color: "white" }}
            >
                🛒 Add to Cart
            </button>

            <button
                onClick={() => onDelete(product.id)}
                style={{ marginLeft: "10px", background: "red", color: "white" }}
            >
                ❌ Delete
            </button>
        </li>
    );
}

export default ProductItem;
