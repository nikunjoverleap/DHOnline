import { createSlice } from '@reduxjs/toolkit';
import uniq from 'lodash.uniq';

const initialState = {
  promotionsImpressionsIdArr: [],
  promotionClicks: [],
  productImpressions: {},
  productClicks: [],
  currentViewableRowsIndexes: [],
};

const analyticSlice = createSlice({
  name: 'analytic',
  initialState,
  reducers: {
    setPromotionsImpressionsIdArr(state, action) {
      state.promotionsImpressionsIdArr = [
        ...state.promotionsImpressionsIdArr,
        ...action.payload,
      ];
    },
    setPromotionClicks(state, action) {
      state.promotionClicks = action.payload;
    },
    setProductImpressions(state, action) {
      state.productImpressions = {
        ...state.productImpressions,
        [action?.payload?.item_list_id]: {
          ...action.payload,
          items: [
            ...(state.productImpressions.items || []),
            ...(action.payload?.items || []),
          ],
        },
      };
    },
    setProductClicks(state, action) {
      state.productClicks = action.payload;
    },
    setCurrentViewableRowsIndexes(state, action) {
      state.currentViewableRowsIndexes = uniq([
        //  ...state.currentViewableRowsIndexes,
        ...action.payload,
      ]);
    },
  },
});

export const {
  setPromotionsImpressionsIdArr,
  setPromotionClicks,
  setProductImpressions,
  setProductClicks,
  setCurrentViewableRowsIndexes,
} = analyticSlice.actions;
const analyticReducer = analyticSlice.reducer;

export default analyticReducer;
