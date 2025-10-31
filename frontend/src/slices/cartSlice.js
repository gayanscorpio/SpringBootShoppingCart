// cartSlice.js
//a Cart slice in Redux (cartSlice.js):
//Actions: addItem, removeItem, clearCart, setCart
//State: items (array), maybe totalPrice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // let redux-persist handle loading from storage
};

//we don’t interact with localStorage directly anymore—redux-persist will handle it.
const cartSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            //localStorage.setItem("cart", JSON.stringify(state.items));
            // ✅ Save per-user cart
            const username = localStorage.getItem("username");
            if (username) {
                localStorage.setItem(`cart_${username}`, JSON.stringify(state.items));
            }
        },
        removeItem: (state, action) => {
            // state → is the current cart slice of state (e.g. { items: [...] })
            //action → is the object { type: "carts/removeItem", payload: 123 }
            //action.payload = the id of the product you clicked.
            //keep the item only if its id is NOT equal to the id we’re removing.
            state.items = state.items.filter(item => item.id !== action.payload);

            // Now update localStorage so it stays in sync for this logged-in user
            //Each logged-in user has their own cart saved separately.
            //When one user removes something, 
            //we must update their own saved cart, not the global or shared one.
            const username = localStorage.getItem("username");
            if (username) {
                localStorage.setItem(`cart_${username}`, JSON.stringify(state.items));
            }
        },
        clearCart: (state) => {
            state.items = []; //✅ This clears the Redux store,

            // Clear localStorage for this logged-in user
            const username = localStorage.getItem("username");
            if (username) {
                localStorage.removeItem(`cart_${username}`);
            }
        },
        setCart: (state, action) => {
            state.items = action.payload;
        }
    }
});

export const { addItem, removeItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
