import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  homePageLoading: false,
  categoryPageLoading: false,
  homePageFailed: false,
  homePageData: {},
};

const plpSlice = createSlice({
  name: 'plp',
  initialState,
  reducers: {
    setHomePageLoading(state, action) {
      state.homePageLoading = true;
    },
    setProductList(state, action) {
      state.homePageLoading = false;
      state.homePageFailed = false;
      state.homePageData = action.payload;
    },
    setHomePageFailed(state, action) {
      state.homePageFailed = true;
    },
  },
});

export const { setProductList, setHomePageLoading, setHomePageFailed } =
  plpSlice.actions;
const plpReducer = plpSlice.reducer;

export default plpReducer;
