import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/config/api";

const GUEST_CART_STORAGE_KEY = "guest-cart";

function getEmptyCart() {
  return {
    items: [],
  };
}

function normalizeGuestCart(rawCart) {
  if (!rawCart || !Array.isArray(rawCart.items)) {
    return getEmptyCart();
  }

  return {
    items: rawCart.items.map((item) => ({
      productId: item.productId,
      image: item.image,
      title: item.title,
      price: Number(item.price) || 0,
      salePrice: Number(item.salePrice) || 0,
      quantity: Number(item.quantity) || 1,
      totalStock: Number(item.totalStock) || 0,
    })),
  };
}

function readGuestCart() {
  if (typeof window === "undefined") {
    return getEmptyCart();
  }

  try {
    const storedCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return storedCart ? normalizeGuestCart(JSON.parse(storedCart)) : getEmptyCart();
  } catch (error) {
    return getEmptyCart();
  }
}

function persistGuestCart(cart) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify(normalizeGuestCart(cart))
  );
}

function clearGuestCart() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

function buildGuestCartItem(product, quantity) {
  return {
    productId: product?._id,
    image: product?.image,
    title: product?.title,
    price: Number(product?.price) || 0,
    salePrice: Number(product?.salePrice) || 0,
    quantity,
    totalStock: Number(product?.totalStock) || 0,
  };
}

const initialState = {
  cartItems: getEmptyCart(),
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, product }, { getState }) => {
    if (!userId) {
      const cart = readGuestCart();
      const state = getState();
      const fallbackProduct =
        product ||
        state.shopProducts?.productDetails ||
        state.shopProducts?.productList?.find((item) => item?._id === productId);

      if (!fallbackProduct?._id) {
        return {
          success: false,
          message: "Product details are unavailable. Please refresh and try again.",
          data: cart,
        };
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );
      const currentQuantity =
        existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
      const totalStock = Number(fallbackProduct?.totalStock) || 0;

      if (currentQuantity + quantity > totalStock) {
        return {
          success: false,
          message: `Only ${Math.max(totalStock, currentQuantity)} quantity can be added for this item`,
          data: cart,
        };
      }

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].totalStock = totalStock;
      } else {
        cart.items.push(buildGuestCartItem(fallbackProduct, quantity));
      }

      persistGuestCart(cart);

      return {
        success: true,
        data: cart,
      };
    }

    const response = await axios.post(`${API_BASE_URL}/shop/cart/add`, {
      userId,
      productId,
      quantity,
    });

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    if (!userId) {
      return {
        success: true,
        data: readGuestCart(),
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}/shop/cart/get/${userId}`
    );

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    if (!userId) {
      const cart = readGuestCart();
      const updatedCart = {
        items: cart.items.filter((item) => item.productId !== productId),
      };

      persistGuestCart(updatedCart);

      return {
        success: true,
        data: updatedCart,
      };
    }

    const response = await axios.delete(
      `${API_BASE_URL}/shop/cart/${userId}/${productId}`
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { getState }) => {
    if (!userId) {
      const cart = readGuestCart();
      const state = getState();
      const product =
        state.shopProducts?.productList?.find((item) => item?._id === productId) ||
        state.shopProducts?.productDetails;
      const updatedCart = {
        items: cart.items.map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity,
            totalStock: Number(product?.totalStock) || item.totalStock || 0,
          };
        }),
      };

      persistGuestCart(updatedCart);

      return {
        success: true,
        data: updatedCart,
      };
    }

    const response = await axios.put(
      `${API_BASE_URL}/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

export const syncGuestCartToServer = createAsyncThunk(
  "cart/syncGuestCartToServer",
  async (userId, { dispatch }) => {
    if (!userId) {
      return {
        success: false,
        data: readGuestCart(),
      };
    }

    const guestCart = readGuestCart();

    if (!guestCart.items.length) {
      const response = await dispatch(fetchCartItems(userId));
      return response.payload;
    }

    for (const item of guestCart.items) {
      await axios.post(`${API_BASE_URL}/shop/cart/add`, {
        userId,
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    clearGuestCart();

    const response = await dispatch(fetchCartItems(userId));
    return response.payload;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getEmptyCart();
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getEmptyCart();
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getEmptyCart();
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getEmptyCart();
      })
      .addCase(syncGuestCartToServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncGuestCartToServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload?.data || getEmptyCart();
      })
      .addCase(syncGuestCartToServer.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
