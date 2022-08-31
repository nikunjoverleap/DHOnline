import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'reduxjs-toolkit-persist/es/constants';
import { persistReducer } from 'reduxjs-toolkit-persist';
import persistStore from 'reduxjs-toolkit-persist/es/persistStore';

import settingsReducer from './settings/settingsSlice';
import screenReducer from './src/slicers/screens/screenSlice';

import { REDUX_PERSIST_KEY } from './config.js';
import authReducer from './src/slicers/auth/authSlice';
import analyticReducer from './src/slicers/analytic/analyticSlice';
import checkoutReducer from './src/slicers/checkout/checkoutSlice';
import landingReducer from './src/slicers/landing/landingSlice';
import plpReducer from './src/slicers/plp/plpSlice';
import pdpReducer from './src/slicers/pdp/pdpSlice';
import wishlistReducer from './src/slicers/wishlist/wishlistSlice';
import orderConfirmationReducer from './src/slicers/orderConfirmation/orderConfirmationSlice';
import ClickAndCollectReducer from './src/slicers/ClickAndCollect/ClickAndCollectSlice';

// const persistConfig = {
//   key: REDUX_PERSIST_KEY,

//   whitelist: ['menu', 'settings', 'lang'],
// };
const persistConfig = {
  key: REDUX_PERSIST_KEY,
  version: 1,
  storage: AsyncStorage,
  whitelist: ['settings'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    settings: settingsReducer,
    screens: screenReducer,
    auth: authReducer,
    cart: checkoutReducer,
    analytic: analyticReducer,
    landing: landingReducer,
    plp: plpReducer,
    pdp: pdpReducer,
    wishlist: wishlistReducer,
    orderConfirmation: orderConfirmationReducer,
    clickAndCollect: ClickAndCollectReducer,
  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const persistedStore = persistStore(store);
export { store, persistedStore };
