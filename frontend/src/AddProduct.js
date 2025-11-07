/**
 * User fills form.
On submit → GraphQL createProduct mutation to backend.
Backend saves product → returns new product data.
Redux updates instantly (so user sees new product in list).
Form resets.
 */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PRODUCT } from './graphql/productQueries';
import { useDispatch } from 'react-redux';
import { addProducts } from './slices/ProductSlice';

function AddProduct() {
    // useState manages form input fields.
    //➡ State for product form fields.
    //Each input field updates a part of this object.
    const [form, setForm] = useState({ name: '', description: '', price: 0, sku: '', isAdult: false });

    //call createProduct({ variables: { input: form } }), it sends the mutation to backend.
    const [createProduct] = useMutation(CREATE_PRODUCT);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevents default page reload.

        //Executes GraphQL mutation to create product in backend.
        const { data } = await createProduct({ variables: { input: form } });

        //Adds new product into Redux state (instant UI update).
        dispatch(addProducts(data.createProduct));
        //Clears form inputs after submit.
        setForm({ name: '', description: '', price: 0, sku: '', isAdult: false });
    };

    return (
        //When submitted → calls handleSubmit().
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
            <input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
            />
            <input
                placeholder="SKU"
                value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })}
            />

            {/* 🔹 New checkbox for adult restriction */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                    type="checkbox"
                    checked={form.isAdult}
                    onChange={e => setForm({ ...form, isAdult: e.target.checked })}
                />
                Restricted (18+)
            </label>
            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '8px', border: 'none', borderRadius: '5px' }}>
                Add Product
            </button>
        </form>
    );
}

export default AddProduct;
