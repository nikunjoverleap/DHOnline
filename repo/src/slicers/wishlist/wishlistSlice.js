import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistProductList: [],
  wishlistSkuList: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistProductList(state, action) {
      state.wishlistProductList = [...action.payload];
      let wishlist = action.payload;
      let skuArray = [];
      wishlist?.map((item) => {
        skuArray.push(item?.product?.sku);
      });
      state.wishlistSkuList = [...skuArray];
    },
  },
});

export const { setWishlistProductList } = wishlistSlice.actions;
const wishlistReducer = wishlistSlice.reducer;

export default wishlistReducer;
