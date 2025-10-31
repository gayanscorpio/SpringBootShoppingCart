import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.items.find((item) => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
            }

            const username = localStorage.getItem("username");
            if (username) {
                localStorage.setItem(`wishlist_${username}`, JSON.stringify(state.items));
            }
        },

        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);

            const username = localStorage.getItem("username");
            if (username) {
                localStorage.setItem(`wishlist_${username}`, JSON.stringify(state.items));
            }
        },

        // ✅ Load wishlist when user logs in
        setWishlist: (state, action) => {
            state.items = action.payload;
        },

        // ✅ Clear wishlist (on logout or checkout)
        clearWishlist: (state) => {
            state.items = [];
            const username = localStorage.getItem("username");
            if (username) {
                localStorage.removeItem(`wishlist_${username}`);
            }
        },

        setWishlist: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    setWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
