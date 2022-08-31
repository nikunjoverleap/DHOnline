/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Analytics  from 'appcenter-analytics';


import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import codePush from 'react-native-code-push';
import { Settings } from 'react-native-fbsdk-next';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import PolyfillCrypto from 'react-native-webview-crypto';

import { SafeAreaProvider } from 'react-native-safe-area-context';

//screens
import SplashScreen from './src/screens/Splash/SplashScreen';

import ChooseCountryScreen from './src/screens/ChooseCountry/ChooseCountryScreen';

import PlpScreen from './src/screens/Plp';

import I18n from 'i18n-js';
import { SCREEN_NAME_PLP, STATUS_BAR_COLOR } from './src/constants';
import SearchProduct from './src/screens/Home/SearchProductCrossplay';
// import InvisibleScreen from './src/screens/InvisibleScreen';
import translations from './src/translations';
import { persistedStore, store } from './store';
//import SearchProduct from './src/screens/Home/Autocomplete';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Sentry from '@sentry/react-native';
import { Adjust, AdjustConfig } from 'react-native-adjust';
import Toast from 'react-native-toast-message';
import ApolloClientMagento from './src/ApolloClientMagento';
import BottomTabs from './src/components/BottomTabs';
import {
  Analytics_Events,
  sentry_identify_user,
  toastConfig,
} from './src/helper/Global';
import AddressInputScreen from './src/screens/AddressInputScreen';
import AddressListingScreen from './src/screens/AddressListingScreen';
import ClickAndCollectScreen from './src/screens/ClickAndCollect/ClickAndCollectScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import MyAccountWebView from './src/screens/MyAccount/components/MyAccountWebView';
import MyOrderDetails from './src/screens/MyAccount/MyOrders/MyOrderDetails';
import MyOrders from './src/screens/MyAccount/MyOrders/MyOrders';
import MyCartScreen from './src/screens/MyCart';
import CheckoutScreen from './src/screens/MyCart/CheckoutScreen';
import CreateSummary from './src/screens/MyCart/CreateSummary';
import OrderConfirmationScreen from './src/screens/OrderConfirmation/OrderConfirmationScreen';
import PDP from './src/screens/PDP';
import SearchResult from './src/screens/SearchResult';
import { env } from './src/src/config/env';
import ChooseDeliveryTypeScreen from './src/screens/ChooseDeliveryTypeScreen';
import OldHomeScreen from './src/screens/OldHomeScreen';

I18n.fallbacks = true;
I18n.translations = translations;

Sentry.init({
  dsn: env.DSN,
  environment: env.SENTRY_ENVIRONMENT,
  maxBreadcrumbs: 5,
});

const Stack = createStackNavigator();

GoogleSignin.configure({
  webClientId: '',
  offlineAccess: false,
  forceCodeForRefreshToken: true,
  iosClientId: env.GOOGLE_IOS_CLIENT_ID,
});

Settings.setAppID(env.FACEBOOK_APP_ID);
Settings.initializeSDK();

const adjustConfig = new AdjustConfig(
  'bv6qphknkrgg',
  AdjustConfig.EnvironmentSandbox
);
Adjust.create(adjustConfig);

const App = () => {
  const client = ApolloClientMagento;
  const linking = {
    prefixes: ['danubehome://app/'],
  };

  // var adjustEvent = new AdjustEvent('abc123');
  // adjustEvent.setRevenue(0.01, 'EUR');
  // Adjust.trackEvent(adjustEvent);

  // adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose); // enable all logging
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug); // enable more logging

  useEffect(() => {
    Analytics.trackEvent("test DHONLINE event");
    sentry_identify_user();

    adjustConfig.setReadMobileEquipmentIdentity(true);

    Adjust.requestTrackingAuthorizationWithCompletionHandler(function (status) {
      switch (status) {
        case 0:
          Analytics_Events({
            eventName: 'app_att',
            params: { status: 'not_determinted' },
          });
          // ATTrackingManagerAuthorizationStatusNotDetermined case
          break;
        case 1:
          Analytics_Events({
            eventName: 'app_att',
            params: { status: 'not_restricted' },
          });
          // ATTrackingManagerAuthorizationStatusRestricted case
          break;
        case 2:
          Analytics_Events({
            eventName: 'app_att',
            params: { status: 'denied' },
          });
          // ATTrackingManagerAuthorizationStatusDenied case
          break;
        case 3:
          Analytics_Events({
            eventName: 'app_att',
            params: { status: 'authorized' },
          });
          // ATTrackingManagerAuthorizationStatusAuthorized case
          break;
      }
    });
    return () => {
      Adjust.componentWillUnmount();
    };

    // RNLocalize.addEventListener('change', () => {
    // setLocalLangauge(); // there is no language support
    // });
  }, []);

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <StatusBar
          animated={true}
          backgroundColor={STATUS_BAR_COLOR}
          barStyle={'dark-content'}
        />
        <PolyfillCrypto />

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <NavigationContainer linking={linking}>
              <Stack.Navigator>
                <Stack.Screen
                  name="Splash"
                  component={SplashScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="App"
                  component={BottomTabs}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ChooseCountry"
                  component={ChooseCountryScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="SearchProduct"
                  component={SearchProduct}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="SearchResult"
                  component={SearchResult}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name={SCREEN_NAME_PLP}
                  component={PlpScreen}
                  options={{
                    lazy: false,
                    headerShown: true,
                    title: '',
                    headerBackTitleVisible: false,
                    headerTintColor: '#000',
                  }}
                />
                <Stack.Screen
                  name="Wishlist"
                  component={WishListScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Thanks"
                  component={OrderConfirmationScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="ClickAndCollect"
                  component={ClickAndCollectScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="Checkout"
                  component={CheckoutScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                    title: '',
                    headerBackTitleVisible: false,
                    headerTintColor: '#000',
                  }}
                />
                <Stack.Screen
                  name="AddressInput"
                  component={AddressInputScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="AddressListing"
                  component={AddressListingScreen}
                  options={{
                    lazy: false,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="My Cart"
                  component={MyCartScreen}
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="CreateSummary"
                  component={CreateSummary}
                  options={{
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="PDP"
                  component={PDP}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MY_ACCOUNT_WEB_VIEW"
                  component={MyAccountWebView}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MyOrders"
                  component={MyOrders}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MyOrderDetails"
                  component={MyOrderDetails}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="LandingPage"
                  component={HomeScreen}
                  options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000',
                  }}
                />
                <Stack.Screen
                  name="ChooseDeliveryType"
                  component={ChooseDeliveryTypeScreen}
                  options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000',
                  }}
                />
                <Stack.Screen
                  name="OldHomeScreen"
                  component={OldHomeScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>

            {/* <InvisibleScreen /> */}
            {/* TODO: Check why ref is used here, check whether this cause any problem */}
            <Toast config={toastConfig} />
            {/* <Toast ref={(ref) => Toast.setRef(ref)} config={toastConfig} /> */}
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
};

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

export default codePush(codePushOptions)(App);
