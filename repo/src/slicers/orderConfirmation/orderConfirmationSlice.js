import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  homePageLoading: false,
  categoryPageLoading: false,
  orderDetails: {},
  isOrderSucess: false,
  orderConfirmationLoading: true,
};

const orderConfirmationSlice = createSlice({
  name: 'orderConfirmation',
  initialState,
  reducers: {
    setOrderConfirmationDetails(state, action) {
      state.orderDetails = action.payload;
    },
    setOrderStatus(state, action) {
      state.isOrderSucess = action.payload;
      state.orderConfirmationLoading = false;
    },
    setOrderConfirmationLoader(state) {
      state.orderConfirmationLoading = false;
    },
  },
});

export const {
  setOrderConfirmationDetails,
  setOrderStatus,
  setOrderConfirmationLoader,
} = orderConfirmationSlice.actions;
const orderConfirmationReducer = orderConfirmationSlice.reducer;

export default orderConfirmationReducer;
