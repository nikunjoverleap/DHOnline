import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  homePageLoading: false,
  categoryPageLoading: false,
  homePageFailed: false,
  homePageData: {},
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    setHomePageLoading(state, action) {
      state.homePageLoading = true;
    },
    setHomePage(state, action) {
      state.homePageLoading = false;
      state.homePageFailed = false;
      state.homePageData = action.payload;
    },
    setHomePageFailed(state, action) {
      state.homePageFailed = action.payload;
    },
  },
});

export const { setHomePage, setHomePageLoading, setHomePageFailed } =
  landingSlice.actions;
const landingReducer = landingSlice.reducer;

export default landingReducer;
