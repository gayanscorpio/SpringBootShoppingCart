//🔹 3. Redux Store + Slice for Products
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/ProductSlice"

const store = configureStore({
    reducer: {
        products: productReducer,
    }
})

export default store;