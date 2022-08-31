import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pwaGuestToken: '',
  pwaCheckoutToken: '',
  cartItems: {},
  cartItemsLoading: true,
  deliveryTypes: [],
  paymentTypes: [],
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setUserCartItems(state, action) {
      state.cartItems = action.payload;
      state.cartItemsLoading = false;
    },
    addCartLoader(state) {
      state.cartItemsLoading = true;
    },
    removeCartLoader(state) {
      state.cartItemsLoading = false;
    },
    setDeliveryTypes(state, action) {
      state.deliveryTypes = action.payload?.estimateShippingCosts;
    },
    setPaymentTypes(state, action) {
      state.paymentTypes = action.payload;
    },
  },
});

export const {
  setUserCartItems,
  removeCartLoader,
  setDeliveryTypes,
  setPaymentTypes,
  addCartLoader,
} = checkoutSlice.actions;
const checkoutReducer = checkoutSlice.reducer;

export default checkoutReducer;
