import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopReviewSlice from "./shop/review-slice";
import commonSlice from "./common-slice";
import adminUsersSlice from "./admin/users-slice";  


const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopReview: shopReviewSlice,
        common: commonSlice,
        adminUsers: adminUsersSlice,
    },
});

export default store;

