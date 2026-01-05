// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userListReducer, userLoginReducer } from './reducers/userReducers';
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
} from './reducers/productReducers';

const reducer = {
  userList: userListReducer,
  userLogin: userLoginReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
};

const preloadedState = {};

const store = configureStore({
  reducer,
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values like functions in actions
      immutableCheck: true, // Enable immutable state check
    }),
});

export default store;