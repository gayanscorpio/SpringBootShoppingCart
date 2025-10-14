import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PRODUCT } from './graphql/productQueries';
import { useDispatch } from 'react-redux';
import { addProducts } from './slices/ProductSlice';

function AddProduct() {
    const [form, setForm] = useState({ name: '', description: '', price: 0, sku: '' });
    const [createProduct] = useMutation(CREATE_PRODUCT);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await createProduct({ variables: { input: form } });
        dispatch(addProducts(data.createProduct));
        setForm({ name: '', description: '', price: 0, sku: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} />
            <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default AddProduct;
