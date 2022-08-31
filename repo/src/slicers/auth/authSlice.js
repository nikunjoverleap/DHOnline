import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import analytics from '@react-native-firebase/analytics';
import getAge from 'get-age';
import OneSignal from 'react-native-onesignal';
import SmartechSDK from 'smartech-reactnative-module';
import {
  DH_ONLINE_PWA_GUEST_TOKEN,
  DH_ONLINE_USER_TOKEN,
  PWA_AUTH_TOKEN_KEY,
  PWA_GUEST_TOKEN_KEY,
} from '../../constants';
import { logError, logInfo } from '../../helper/Global';
import { targetToNewUrl } from '../../helper/url';
import DefaultPreference from 'react-native-default-preference';

const initialState = {
  pwaGuestToken: '',
  pwaAuthToken: '',
  country: 'ae',
  language: '',
  countryData: '',
  userToken: '',
  webViewVisibility: false,
  isGuest: true,
  userProfile: {},
  webviewAppUrl: targetToNewUrl({
    relativeUrl: '/',
    country: '',
    language: '',
  }),
  remoteConfig: { new_app_enabled: '0' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPWATokens(state, action) {
      const {
        payload: {
          [PWA_GUEST_TOKEN_KEY]: pwaGuestToken,
          [PWA_AUTH_TOKEN_KEY]: pwaAuthToken,
          store = 'ae_en',
        } = {},
      } = action;
      state.pwaGuestToken = pwaGuestToken;
      state.pwaAuthToken = pwaAuthToken;
      if (pwaAuthToken) {
        state.isGuest = false;
      }
      const [country, language] = store.split('_');
      if (!state.country) {
        state.country = country;
        state.language = language;
      }
    },
    setPWAGuestToken(state, action) {
      if (!action.payload) {
        delete state.pwaGuestToken;
        AsyncStorage.removeItem(DH_ONLINE_PWA_GUEST_TOKEN);
      } else {
        AsyncStorage.setItem(DH_ONLINE_PWA_GUEST_TOKEN, action.payload);
        state.pwaGuestToken = action.payload;
      }
    },

    setCountry(state, action) {
      if (action.payload) {
        state.country = action.payload;
        AsyncStorage.setItem('countryCode', state.country);
      }
    },
    setCountryData(state, action) {
      // this function is deprecated
      // state.countryData = action.payload;
      // const [country] = (action.payload?.store || '').split('_');
      // if (country) {
      //   state.country = country;
      //   AsyncStorage.setItem('countryCode', state.country);
      // }
    },
    setUserToken(state, action) {
      state.userToken = action.payload;
      state.isGuest = false;
    },
    setLogout(state, ion) {
      AsyncStorage.removeItem(DH_ONLINE_USER_TOKEN);
      delete state.userToken;
      state.isGuest = true;
      delete state.userProfile;
      SmartechSDK.logoutAndClearUserIdentity(true);
      // to do
    },
    setUserProfile(state, action) {
      try {
        state.userProfile = action.payload;
        const {
          customer = {},
          updateAnalytics,
          country = 'ae',
          language = 'en',
        } = state.userProfile || {};
        if (updateAnalytics) {
          const {
            firstname,
            lastname,
            email,
            is_social_login: isSocialLogin,
            social_login_type: socialLoginType,
            is_subscribed: isSubscribedToNewletter,
            dob,
            id,
            mobilenumber,
            // created_at: createdAt,
          } = customer;
          AsyncStorage.setItem(
            'UserProfile',
            JSON.stringify(state.userProfile)
          );
          const payloadata = {
            FIRST_NAME: firstname,
            LAST_NAME: lastname,
            EMAIL: email,
            isSocialLogin: Number(isSocialLogin),
            isSubscribedToNewletter: Number(isSubscribedToNewletter),
            socialLoginType,
            COUNTRY: country,
            LANGUAGE: language,
          };
          if (dob) {
            try {
              payloadata.AGE = Number(getAge(dob));
            } catch (e) {
              logError(e, { where: 'AGE Calculation ERROR' });
            }
          }
          if (mobilenumber && Number(mobilenumber) > 0) {
            payloadata.MOBILE = Number(mobilenumber);
            try {
              OneSignal.setSMSNumber(String(mobilenumber));
            } catch (e) {
              logError(e);
            }
          }
          // SmartechSDK.setUserLocation(19.076, 72.8777); // Location needs to be updated based on the info
          const currentIdentity = SmartechSDK.getUserIdentity((any) => {
            logInfo('SMARTECH EXISTNG IDENTITY', any);
          });
          if (email) {
            SmartechSDK.login(email);
            OneSignal.setExternalUserId(String(id));
            OneSignal.setEmail(email);
            analytics().setUserId(String(id));
          }
          const updateRsult = SmartechSDK.updateUserProfile(payloadata);
          OneSignal.sendTags(payloadata);
        }
      } catch (e) {
        logError(e);
      }
    },
    setLanguage(state, action) {
      if (['en', 'ar'].includes(action.payload)) {
        state.language = action.payload;
        AsyncStorage.setItem('LANGUAGE', state.language);
        DefaultPreference.set('LANGUAGE', state.language);
        state.webviewAppUrl = targetToNewUrl({
          relativeUrl: '/',
          country: state.country,
          language: state.language,
        });
        OneSignal.setLanguage(state.language);
      }
    },
    setWebViewVisible(state, action) {
      if (!!action.payload?.webViewVisibility) {
        state.webviewAppUrl = action.payload?.webviewAppUrl;
      }
      // setTimeout(() => {
      state.webViewVisibility = !!action.payload?.webViewVisibility;
    },
    setRemoteConfig(state, action) {
      state.remoteConfig = action.payload;
      AsyncStorage.setItem('remoteConfig', JSON.stringify(action.payload));
    },
  },
});

export const {
  setPWATokens,
  setPWAGuestToken,
  setCountry,
  setUserToken,
  setUserProfile,
  setLanguage,
  setWebViewVisible,
  setLogout,
  setRemoteConfig,
} = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
