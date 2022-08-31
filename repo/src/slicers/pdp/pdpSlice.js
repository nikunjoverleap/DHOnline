import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productDetails: {},
  linkingURL: [],
  groupProduct: [],
};

const plpSlice = createSlice({
  name: 'pdp',
  initialState,
  reducers: {
    setProductDetails(state, action) {
      state.productDetails = action.payload;
    },
    setLinkingURL(state, action) {
      state.linkingURL = action.payload;
    },
    setGroupProductData(state, action) {
      state.groupProduct = action.payload;
    },
  },
});

export const { setProductDetails, setLinkingURL, setGroupProductData } = plpSlice.actions;
const pdpReducer = plpSlice.reducer;

export default pdpReducer;
