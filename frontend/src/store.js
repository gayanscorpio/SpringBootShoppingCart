//🔹 3. Redux Store + Slice for Products
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import cartReducer from "./slices/cartSlice";
import productReducer from './slices/ProductSlice';
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import wishlistReducer from "./slices/wishlistSlice";

// Persist cart config
const cartPersistConfig = {
    key: "carts",
    storage,
};

const rootReducer = combineReducers({
    carts: persistReducer(cartPersistConfig, cartReducer), // persisted
    products: productReducer, // normal (not persisted)
    wishlist: wishlistReducer
});

// Configure store
const store = configureStore({
    reducer: rootReducer, // state.cart
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions to remove warnings
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

//✅ Here we’re telling redux - persist to store the cart slice in localStorage.
export const persistor = persistStore(store);
export default store;