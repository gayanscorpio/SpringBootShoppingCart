import React, { useEffect } from "react";
import { useQuery, useSubscription, useMutation } from "@apollo/client/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ Add navigation
import { GET_PRODUCTS, PRODUCT_ADDED, DELETE_PRODUCT } from "./graphql/productQueries";
import { setProducts, deleteProduct, addProducts } from "./slices/ProductSlice";
import { addItem } from "./slices/cartSlice"; // ✅ Add cart slice import
import ProductItem from "./ProductItem";

function ProductList() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // ✅ hook for navigation
    const products = useSelector((state) => state.products?.items || []);

    // ✅ Initial fetch
    const { loading, error, data } = useQuery(GET_PRODUCTS);

    // ✅ Subscription for live product additions
    const { data: subData } = useSubscription(PRODUCT_ADDED);

    // ✅ Delete mutation
    const [deleteProductMutation] = useMutation(DELETE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }],
    });

    // ✅ Load initial product data into Redux
    useEffect(() => {
        if (data) dispatch(setProducts(data.products));
    }, [data, dispatch]);

    // ✅ Handle new product added via subscription
    useEffect(() => {
        if (subData?.productAdded) dispatch(addProducts(subData.productAdded));
    }, [subData, dispatch]);

    // ✅ Delete a product
    const handleDelete = async (id) => {
        await deleteProductMutation({ variables: { id } });
        dispatch(deleteProduct(id));
    };

    // ✅ Add to cart + navigate
    const handleAddToCart = (product) => {
        dispatch(addItem(product)); // add to cart state
        navigate("/cart"); // redirect to cart page
    };

    // ✅ Render section
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>🛍️ Product List</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {products.map((p) => (
                    <ProductItem
                        key={p.id}
                        product={{ ...p, price: Number(p.price) }}
                        onDelete={handleDelete}
                        onAddToCart={handleAddToCart} // ✅ Pass this down
                    />
                ))}
            </ul>
        </div>
    );
}

export default ProductList;
