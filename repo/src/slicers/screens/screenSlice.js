import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';
import {
  COMPONENT_NAME_BOTTOM_NAVIGATION,
  SCREEN_NAME_HOME,
  SCREEN_NAME_LOGIN_AND_REGISTRATION,
  COMPONENT_NAME_LOGIN,
  COMPONENT_NAME_REGISTRATION,
} from '../../constants';
import { getConfigValue } from '../../helper/getConfigValue';
// import { DEFAULT_USER, IS_DEMO } from 'config.js';

const initialState = {
  screenSettings: {},
  splashLoading: false,
};

function setScreenSettingsConfig(screenData = {}) {
  screenData.componentsOrder = [];
  screenData.components = {};

  screenData?.componentsCollection?.items.forEach((item) => {
    const newItem = { ...item };
    if (newItem?.config) {
      const newConfig = {};
      map(newItem?.config, (configData, key) => {
        newConfig[key] = getConfigValue({
          configData,
          country: 'ae',
          abValue: 'b',
        });
      });
      newItem.config = newConfig;
    }
    screenData.componentsOrder.push(newItem.componentName);
    screenData.components[newItem.componentName] = newItem;
  });
  return screenData;
}
const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setSplashLoading(state, action) {
      state.splashLoading = true;
    },
    setScreenSettings(state, action) {
      if (!action.payload) {
        return false;
      }
      state.splashLoading = false;
      state.screenSettings = {};

      action.payload?.screensCollection?.items?.forEach((item) => {
        state.screenSettings[item.screenName] = setScreenSettingsConfig({
          ...item,
        });
      });
      const homeScreen = { ...state.screenSettings[SCREEN_NAME_HOME] };
      if (homeScreen?.componentsCollection) {
        homeScreen.bottomNavigations =
          homeScreen?.componentsCollection?.items.find((item) => {
            return item.componentName === COMPONENT_NAME_BOTTOM_NAVIGATION;
          });
        state.screenSettings[SCREEN_NAME_HOME] = homeScreen;

        const loginRegisterScreen = {
          ...state.screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION],
        };
        loginRegisterScreen.loginScreen =
          loginRegisterScreen?.componentsCollection?.items.find((item) => {
            return item.componentName === COMPONENT_NAME_LOGIN;
          });

        loginRegisterScreen.registrationScreen =
          loginRegisterScreen?.componentsCollection?.items.find((item) => {
            return item.componentName === COMPONENT_NAME_REGISTRATION;
          });

        state.screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION] =
          loginRegisterScreen;

        // state.screenSettings[SCREEN_NAME_PLP] = setScreenSettingsConfig({
        //   ...state.screenSettings[SCREEN_NAME_PLP],
        // });

        AsyncStorage.setItem('SCREEN_SETTINGS', JSON.stringify(action.payload));
      }
    },
  },
});

export const { setScreenSettings, setSplashLoading } = screenSlice.actions;
const screenReducer = screenSlice.reducer;

export default screenReducer;
