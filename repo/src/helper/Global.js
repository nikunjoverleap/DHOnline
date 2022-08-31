import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics, { firebase } from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import axios from 'axios';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
import newRelic from 'newrelic-react-native-agent';
import React from 'react';
import { I18nManager } from 'react-native';
import { Adjust, AdjustEvent } from 'react-native-adjust';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import SmartechSDK from 'smartech-reactnative-module';
import DanubeToast from '../components/DanubeToast';
import PaymentDeclinedToast from '../components/DanubeToast/PaymentDeclinedToast';
import {
  DH_ONLINE_USER_TOKEN,
  EVENT_NAME_ADD_REMOVE_FROM_WISHLIST,
  EVENT_NAME_ADD_TO_CART,
  EVENT_NAME_ADD_TO_CART_ERROR,
  EVENT_NAME_ADD_TO_WISHLIST,
  EVENT_NAME_CHECKOUT_OPTION_SELECTED,
  EVENT_NAME_CUSTOM_CLICK,
  EVENT_NAME_LOGIN,
  EVENT_NAME_PAYMENT_FAILED,
  EVENT_NAME_PAYMENT_USER_ABORTED,
  EVENT_NAME_PDP_SHARE,
  EVENT_NAME_PREMOVE_FROM_CART,
  EVENT_NAME_PURCHASE,
  EVENT_NAME_SIGNUP,
  EVENT_NAME_VIEW_CART,
  EVENT_NAME_VIEW_PRODUCT_ITEM,
  LANDED_VIA_PUSH_NOTIFICATION,
  SCREEN_NAME_HOME,
  SCREEN_NAME_LANDING_PAGE,
  SCREEN_NAME_PDP,
  SCREEN_NAME_PLP,
} from '../constants';
import { ADJUST_EVENT_TOKEN_MAPPPING } from '../constants/adjustEventMapping';

firebase.analytics().setAnalyticsCollectionEnabled(true);

export const makeAPIRequest = async (url) =>
  new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        logError(error);
        reject(error);
      });
  });

// eslint-disable-next-line no-magic-numbers
export const rotateIcon = {
  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
};

export const makeAPIPostRequest = async ({ url }) => {
  try {
    return await axios.post(url, data, headers);
  } catch (e) {
    logError(e);
  }
};

export const showToast = ({ message, type = 'error', ...rest }) => {
  Toast.show({
    visibilityTime: 1500,
    text1: message || '',
    type: type,
    ...rest,
  });
};

export const toastConfig = {
  general_toast: ({ props }) => <DanubeToast props={props} />,
  payment_failed_toast: ({ props }) => <PaymentDeclinedToast props={props} />,
};

export const emailValidationReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export const mobileNumberReg = /^((50|51|52|55|56){1}([0-9]{7}))$/;

export const passwordReg =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const apiResponseLog = async (apiName, Parameters, Response, error) => {
  logInfo('API URL ', apiName);
  logInfo('API Parameters ', Parameters);
  logInfo('API Response ', Response);
  if (error) {
    let user_details = {};
    const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
    if (userToken) {
      const user_data = await AsyncStorage.getItem('UserProfile');
      user_details = JSON.parse(user_data);
    }
    Sentry.captureException(error, {
      extra: { ...Parameters, ...Response },
      tags: {
        url: apiName,

        id: userToken ? user_details?.customer?.id : 'Guest',
        phoneNumber: userToken ? user_details?.customer?.mobilenumber : null,
      },
    });
    try {
      newRelic.sendConsole({
        type: 'error',
        args: { apiName, Parameters, Response },
      });
      newRelic.setUserId(userToken ? user_details?.customer?.id : 'Guest');
    } catch (e) {}
  }
};
export const logError = async (error, otherInfo = {}) => {
  try {
    if (__DEV__) {
      console.error(error);
    }
    let user_details = {};

    const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
    if (userToken) {
      const user_data = await AsyncStorage.getItem('UserProfile');
      user_details = JSON.parse(user_data);
    }
    Sentry.captureException(error, {
      extra: otherInfo || {},
      tags: {
        id: userToken ? user_details?.customer?.id : 'Guest',
        phoneNumber: userToken ? user_details?.customer?.mobilenumber : null,
        email: user_details?.customer?.email,
      },
    });
    try {
      newRelic.sendConsole({
        type: 'error',
        args: { error, otherInfo },
      });
      newRelic.setUserId(userToken ? user_details?.customer?.id : 'Guest');
    } catch (e) {}
  } catch (e) {
    console.log('Sentry Error logging Failed', error);
  }
};

export const logInfo = (...rest) => {
  try {
    __DEV__ && console.log(...rest);
    if (rest.includes('force')) {
      console.log(...rest);
    }
  } catch (e) {}
};

const isAdjustEnabled = true;
const pushAdjustEvent = (EventToken, params, eventName) => {
  if (isAdjustEnabled) {
    const adjustEvent = new AdjustEvent(
      ADJUST_EVENT_TOKEN_MAPPPING[eventName] || EventToken
    );
    let entries = Object.entries(params);
    entries?.map(([key, val] = entry) => {
      adjustEvent.addCallbackParameter(key, val?.toString());
    });
    Adjust.trackEvent(adjustEvent);
  }
};
// Firebase Analytics Events
export const Analytics_Events = ({
  eventName,
  params,
  EventToken,
  EventType,
}) => {
  logInfo(`=========Event:  ${eventName} STARTS=======`);
  logInfo('=========Event: ', params);
  logInfo(`=========Event: ${eventName} ENDS=======`);
  try {
    switch (eventName) {
      case 'Promotions_Impressions': {
        analytics().logViewPromotion(params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case 'Promotion_Clicks': {
        analytics().logSelectPromotion(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case 'Product_Impressions': {
        analytics().logViewItemList(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case 'Product_Clicks': {
        analytics().logSelectItem(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case 'Screen_View': {
        analytics().logScreenView(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'Screen_View_Complete': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'Screen_View_Error': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case EVENT_NAME_ADD_TO_CART: {
        analytics().logAddToCart(params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case EVENT_NAME_PREMOVE_FROM_CART: {
        analytics().logRemoveFromCart(params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case EVENT_NAME_ADD_TO_WISHLIST: {
        analytics().logAddToWishlist(params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }

      case EVENT_NAME_ADD_REMOVE_FROM_WISHLIST: {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case EVENT_NAME_ADD_TO_CART_ERROR: {
        analytics().logEvent(eventName, params);
        return;
      }
      case 'Check_Out': {
        analytics().logBeginCheckout(params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case 'AppPush_OptIn': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('User Opt In Push Notification', params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'AppPush_OptOut': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('User Opt Out Push Notification', params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'AppTracking_OptIn': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('User Opt In Tracking', params);
        SmartechSDK.optTracking(true);
        return;
      }
      case 'AppTracking_OptOut': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('User Opt Out Tracking', params);
        SmartechSDK.optTracking(false);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'Choose_Country': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('Choose_Country', params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case EVENT_NAME_PDP_SHARE:
      case EVENT_NAME_CUSTOM_CLICK: {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('custom_click', params);
        pushAdjustEvent(EventToken, params);
        return;
      }
      case 'Nav_Change_Via_External_Link': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('Nav_Change_Via_External_Link', params);
        return;
      }
      case 'app_att': {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent('app_att', params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_SIGNUP: {
        analytics().logSignUp(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_LOGIN: {
        analytics().logLogin(params);
        SmartechSDK.trackEvent(eventName, params);
        pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_VIEW_CART: {
        analytics().logViewCart(params);
        SmartechSDK.trackEvent(eventName, params);
        // pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_PURCHASE: {
        analytics().logPurchase(params);
        SmartechSDK.trackEvent(eventName, params);
        // pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_VIEW_PRODUCT_ITEM: {
        analytics().logViewItem(params);
        SmartechSDK.trackEvent(eventName, params);
        // pushAdjustEvent(EventToken, params, eventName);
        return;
      }
      case EVENT_NAME_CHECKOUT_OPTION_SELECTED: {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
      case EVENT_NAME_PAYMENT_FAILED:
      case EVENT_NAME_PAYMENT_USER_ABORTED: {
        analytics().logEvent(eventName, params);
        SmartechSDK.trackEvent(eventName, params);
        return;
      }
    }

    // DO NOT WRITE IF ELSE CONDITION LIKE BELOW.
    // if (eventName === 'Promotions_Impressions') {
    //   analytics().logViewPromotion(params);
    // } else if (eventName === 'Promotion_Clicks') {
    //   analytics().logSelectPromotion(params);
    // } else if (eventName === 'Product_Impressions') {
    //   analytics().logViewItem(params);
    // } else if (eventName === 'Product_Clicks') {
    //   analytics().logSelectItem(params);
    // } else if (eventName === 'Screen_View') {
    //   analytics().logScreenView(params);
    //   SmartechSDK.trackEvent(eventName, payloadata);
    // } else if (eventName === 'Add_To_Cart') {
    //   analytics().logAddToCart(params);
    // } else if (eventName === 'Check_Out') {
    //   analytics().logBeginCheckout(params);
    // }
  } catch (e) {
    logError(e);
  }
};

export const handleDeepLinking = ({
  deepLinkArray,
  subLink,
  urlKey,
  navigation,
  via,
  linkForLogging,
}) => {
  if (!isEmpty(deepLinkArray)) {
    deeplinkIteration: for (let i = 0; i < deepLinkArray.length; i++) {
      logInfo('Deeplink test Reg  ==> ', deepLinkArray[i]?.exp);
      logInfo('Deeplink test SubLink ==>', subLink);
      const element = deepLinkArray[i];

      if (new RegExp(element?.exp).test(subLink)) {
        // if (element?.to === SCREEN_NAME_PDP) {
        //   navigation.push(element?.to, { urlKey });
        // } else {
        //   navigation.push(element?.to);
        // }
        // break;
        try {
          Analytics_Events('DeeplinkReceived', {
            via,
            linkForLogging,
          });
        } catch (e) {
          logError(e); // TO DO move to common error loggin
        }
        const landed_from_url = linkForLogging;
        const landed_from_push_notification =
          via === LANDED_VIA_PUSH_NOTIFICATION;
        const commonParams = {
          urlKey,
          landed_from_url,
          landed_from_push_notification,
          via,
        };
        switch (element?.to) {
          case SCREEN_NAME_PDP: {
            navigation.push(element?.to, {
              ...commonParams,
            });
            break deeplinkIteration;
          }
          case SCREEN_NAME_PLP: {
            navigation.push(element?.to, {
              plpCategoryId: urlKey,
              ...commonParams,
            });
            break deeplinkIteration;
          }
          case SCREEN_NAME_LANDING_PAGE: {
            navigation.push(SCREEN_NAME_HOME, {
              pageId: urlKey,
              ...commonParams,
            });
            break deeplinkIteration;
          }
          default: {
            navigation.navigate(element?.to, {
              urlKey,
              ...commonParams,
            });
            break deeplinkIteration;
          }
        }
      }
    }
  }
};

export const sentry_identify_user = async () => {
  const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
  const user_data = await AsyncStorage.getItem('UserProfile');
  const user_details = JSON.parse(user_data);
  Sentry.setUser({
    id: userToken ? user_details?.customer?.id : DeviceInfo.getUniqueId(),
    firstName: userToken ? user_details?.customer?.firstname : null,
    lastName: userToken ? user_details?.customer?.lastname : null,
    language: userToken ? user_details?.language : null,
    createdAt: userToken
      ? moment(user_details?.customer?.created_at).format('DD MMMM YYYY')
      : null,
  });
};

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
