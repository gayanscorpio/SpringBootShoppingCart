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
import { jwtDecode } from 'jwt-decode';

function AddProduct() {
    // useState manages form input fields.
    //➡ State for product form fields.
    //Each input field updates a part of this object.
    const [form, setForm] = useState({ name: '', description: '', price: 0, sku: '', isAdult: false });

    // 🔹 for readable error
    const [errorMsg, setErrorMsg] = useState(null);

    //call createProduct({ variables: { input: form } }), it sends the mutation to backend.
    const [createProduct] = useMutation(CREATE_PRODUCT);
    const dispatch = useDispatch();

    // Decode token to check user role
    const token = localStorage.getItem('token');
    let userRole = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
            console.log('user role:', userRole)
        } catch (e) {
            console.error('Invalid token format');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevents default page reload.
        setErrorMsg(null); // reset error message

        try {
            //Executes GraphQL mutation to create product in backend.
            const { data } = await createProduct({ variables: { input: form } });

            //Adds new product into Redux state (instant UI update).
            dispatch(addProducts(data.createProduct));
            //Clears form inputs after submit.
            setForm({ name: '', description: '', price: 0, sku: '', isAdult: false });
        } catch (err) {
            console.error('GraphQL Error:', err);

            // 🔹 Handle backend AccessDeniedException nicely
            const message =
                err.message.includes('Access Denied') || err.message.includes('AccessDeniedException')
                    ? '🚫 You do not have permission to create products. Please contact an admin.'
                    : '⚠️ Something went wrong. Please try again.';

            setErrorMsg(message);
        }
    };

    return (
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            {/* 🔹 Show readable error */}
            {errorMsg && (
                <div style={{ background: '#ffe6e6', color: '#b30000', padding: '8px', borderRadius: '6px' }}>
                    {errorMsg}
                </div>
            )}
        </div>
    );
}

export default AddProduct;
