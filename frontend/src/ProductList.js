import React, { useEffect } from "react";
import { useQuery, useSubscription, useMutation } from '@apollo/client/react';
import { useDispatch, useSelector } from "react-redux";
import { GET_PRODUCTS, PRODUCT_ADDED, DELETE_PRODUCT } from "./graphql/productQueries";
import { setProducts, deleteProduct, addProducts } from "./slices/ProductSlice";

function ProductList() {

    const dispatch = useDispatch();
    const products = useSelector(state => state.products.items);

    // Initial fetch + polling
    const { loading, error, data } = useQuery(GET_PRODUCTS);

    // Subscription for real-time product additions
    const { data: subData } = useSubscription(PRODUCT_ADDED);

    // Delete mutation
    const [deleteProductMutation] = useMutation(DELETE_PRODUCT, {
        refetchQueries: [{ query: GET_PRODUCTS }], // ensures backend and Redux stay in sync
    });

    // Sync initial fetch data with Redux
    useEffect(() => {
        if (data) {
            dispatch(setProducts(data.products));
        }
    }, [data, dispatch]);

    // Handle subscription data
    useEffect(() => {
        if (subData) {
            dispatch(addProducts(subData.productAdded));
        }
    }, [subData, dispatch]);

    const handleDelete = async (id) => {
        await deleteProductMutation({ variables: { id } });
        dispatch(deleteProduct(id)) //if not using refetchQueries
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map(p => (
                    <li key={p.id}>
                        {p.name} - ${p.price}
                        <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ProductList;