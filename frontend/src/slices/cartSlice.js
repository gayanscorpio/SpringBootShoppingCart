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
        },
        removeItem: (state, action) => {
            // state → is the current cart slice of state (e.g. { items: [...] })
            //action → is the object { type: "carts/removeItem", payload: 123 }
            //action.payload = the id of the product you clicked.
            //keep the item only if its id is NOT equal to the id we’re removing.
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
        setCart: (state, action) => {
            state.items = action.payload;
        }
    }
});

export const { addItem, removeItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
