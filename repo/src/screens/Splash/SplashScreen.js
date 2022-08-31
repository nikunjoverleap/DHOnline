import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import OneSignal from 'react-native-onesignal';
import SmartechSDK from 'smartech-reactnative-module';

// import redux for auth guard
import isEmpty from 'lodash.isempty';
import { useDispatch, useSelector, get } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';

import {
  countryList,
  DH_ONLINE_USER_TOKEN,
  SCREEN_NAME_HOME,
  SCREEN_NAME_SPLASH,
} from '../../constants';
import { Analytics_Events, logError, logInfo } from '../../helper/Global';
import {
  setCountry,
  //  setCountryData,
  setLanguage,
  setRemoteConfig,
  setUserToken,
} from '../../slicers/auth/authSlice';
import { setScreenSettings } from '../../slicers/screens/screenSlice';
import { getScreensAndSettings } from './actions';

//import usePushNotificationOneSignal from '../../hooks/usePushNotificationOneSignal';
import { handleDeeplink } from '../../helper/handleDeeplink';
import { useNavigation } from '@react-navigation/native';

const locales = RNLocalize.getLocales();

let globalLanguage = 'en';

if (['en', 'ar'].includes(locales?.[0]?.languageCode)) {
  if (locales?.[0]?.languageCode === 'ar') {
    globalLanguage = 'ar';
  }
}
// AsyncStorage.getItem('LANGUAGE').then((lang) => {
//   if (lang) {
//     globalLanguage = lang;
//     preloadHomeLanguage = lang;
//   }
// });
let preloadHomeLanguage = 'en';
let preloadHomeCountryData;

AsyncStorage.getItem('countryCode').then((countryCode) => {
  if (countryCode) {
    globalCountry = countryCode;
    const countryFound = countryList.find((cn) => cn.isoCode === countryCode);
    preloadHomeCountryData = countryFound;
  }
});

const NATIVE_MOBILE_FOOTER = gql`
  query {
    cmsPage(identifier: "native-mobile-footer") {
      identifier
      url_key
      title
      content
      content_heading
      page_layout
      meta_title
      meta_description
      meta_keywords
    }
  }
`;

export default SplashScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const { linkingURL } = useDynamicURL();
  const [pageInitialized, setPageInitialized] = useState(false);

  const [
    navigateToDeeplinkOrUniversalLink,
    setNavigateToDeeplinkOrUniversalLink,
  ] = useState();
  const { loading, error, data } = useQuery(
    NATIVE_MOBILE_FOOTER,

    { context: { apiName: 'dh' } }
  );

  const formatConfigValues = (values) => {
    const newValues = {};
    Object.keys(values).map((key) => {
      newValues[key] = values[key]._value;
    });
    return newValues;
  };
  const fetchAllRemoteConfig = async () => {
    try {
      await remoteConfig()
        .setDefaults({
          new_app_enabled: '0',
        })

        .then(() => remoteConfig().fetchAndActivate())

        .then((fetchedRemotely) => {
          if (fetchedRemotely) {
            remoteConfig()
              .fetch(0)
              .then((data) => {
                const values = remoteConfig().getAll();
                dispatch(setRemoteConfig(formatConfigValues(values)));
                logInfo(
                  '+++Configs were retrieved from the backend and activated.',
                  values
                );
                if (values.new_app_enabled === '0') {
                  OneSignal.promptForPushNotificationsWithUserResponse(
                    (response) => {
                      logInfo('Prompt response:', response);
                    }
                  );
                }
              });
          } else {
            logInfo(
              '+++++No configs were fetched from the backend, and the local configs were already activated'
            );
          }
        });
    } catch (e) {
      logError(e);
    }
  };
  useEffect(() => {
    fetchAllRemoteConfig();
  }, []);

  const handleCountryData = async ({ countryFound }) => {
    try {
      if (countryFound?.isoCode) {
        await AsyncStorage.setItem('countryCode', countryFound.isoCode);

        props.navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      }
    } catch (e) {
      logError(e);
    }
  };
  const { language, country, countryData } = useSelector((state) => state.auth);
  const { screenSettings, splashLoading } = useSelector(
    (state) => state.screens
  );
  const [contentFulLangCode, setContentfulLanguage] = useState();
  // const {
  //   loading: contentFulLoading,
  //   error: contentFulError,
  //   data: contentFulData,
  // } = useQuery(SCREEN_QUERY_API, {
  //   client: ApolloClientContentFul,
  //   variables: {
  //     limit: 100,
  //     locale: contentFulLangCode,
  //   },
  // });
  logInfo('screenSettings', screenSettings);
  useEffect(() => {
    if (language) {
      setContentfulLanguage(language === 'ar' ? 'ar' : 'en-US');
    }
  }, [language]);
  useEffect(() => {
    if (contentFulLangCode) {
      getScreensAndSettings({ language: contentFulLangCode }, dispatch);
    }
  }, [contentFulLangCode]);
  useEffect(() => {
    AsyncStorage.getItem('SCREEN_SETTINGS').then((screenSettingsStored) => {
      if (screenSettingsStored) {
        dispatch(setScreenSettings(JSON.parse(screenSettingsStored)));
      }
    });
    AsyncStorage.getItem('LANGUAGE').then((lang) => {
      let language = lang;
      if (!language) {
        language = globalLanguage;
      }
      if (language) {
        dispatch(setLanguage(language));
      }
    });
    // dispatch(setLanguage(globalLanguage));
    AsyncStorage.getItem('countryCode').then((countryCode) => {
      if (countryCode) {
        const parseCountryCode = countryCode.split('/')?.[0]; // // Splitted by slash for handling order versions of the app
        dispatch(setCountry(parseCountryCode));
        const countryFound = countryList.find(
          (cn) => cn.isoCode === parseCountryCode
        );
        if (countryFound) {
          // dispatch(setCountryData(countryFound));
        }
      }
    });
    // if (preloadHomeCountryData && preloadHomeLanguage) {
    //   getHomePage(
    //     { countryData: preloadHomeCountryData, language: preloadHomeLanguage },
    //     dispatch
    //   );
    // }
  }, []);

  useEffect(() => {
    Analytics_Events({
      eventName: 'Screen_View',
      params: { screen_name: SCREEN_NAME_SPLASH },
      EventToken: 'qbj2pa',
    });
  }, []);
  // usePushNotificationOneSignal(navigateToDeeplinkOrUniversalLink);

  const setUpOneSignal = () => {
    OneSignal.setLogLevel(6, 0);
    //   OneSignal.setAppId("b037dd07-7000-48a9-96c8-325da2007154"); //dev
    OneSignal.setAppId('962134a3-e748-4384-8240-438f1b636837'); //prod
    //Prompt for push on iOS
    // Moved to Home Screen
    // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    //   logInfo('Prompt response:', response);
    // });
    //OneSignal.setLaunchURLsInApp(false);
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent) => {
        logInfo(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent
        );
        let notification = notificationReceivedEvent.getNotification();
        logInfo('notification: ', notification);
        const data = notification.additionalData;
        logInfo('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
        // alert(`FROM ONE SIGNAL: ${JSON.stringify(notification || {})}`);
      }
    );
  };
  useEffect(() => {
    setUpOneSignal();
    getLocationInfo();
    setPageInitialized(true);
    SmartechSDK.getDeepLinkUrl((deeplink) => {
      logInfo('smartech deeplink received from netcore', deeplink);
      setNavigateToDeeplinkOrUniversalLink(deeplink);
    });
  }, []);
  const [navigated, setNavigated] = useState(false);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      if (
        !splashLoading &&
        screenSettings &&
        screenSettings[SCREEN_NAME_HOME]
      ) {
        // dispatch(setScreenSettings(contentFulData));
        if (!navigated) {
          navigationHandler();
        }
        setNavigated(true);
      } else if (!isEmpty(screenSettings)) {
        if (!navigated) {
          navigationHandler();
        }
        setNavigated(true);
      }
    }, 1600);
    return () => {
      clearTimeout(timer1);
    };
  }, [splashLoading, screenSettings]);

  const navigationHandler = async () => {
    try {
      // const splash_screen = screenSettings[SCREEN_NAME_SPLASH];
      // const DEEPLINK_CONFIG_DATA =
      //   splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;
      // handleDeeplink({
      //   url: 'danubehomeonline://ae/en/furniture/sofas/one-seater-sofas?page=2',
      //   DEEPLINK_CONFIG_DATA,
      //   language: 'en',
      //   country: 'ae',
      //   navigation,
      // });

      const countryCode = await AsyncStorage.getItem('countryCode');
      if (countryCode !== null) {
        let newAppEnabled = false;
        try {
          let remoteConfig = await AsyncStorage.getItem('remoteConfig');
          remoteConfig = JSON.parse(remoteConfig);
          if (remoteConfig.new_app_enabled === '1') {
            newAppEnabled = true;
          }
        } catch (e) {
          logError(e);
        }
        setTimeout(() => {
          if (!newAppEnabled) {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'OldHomeScreen', params: { countryCode: '#' } }],
            });
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'App' }],
            });
          }
        }, 100);
        // const countryFound = countryList.find(
        //   (cn) => cn.isoCode === countryCode
        // );
        let language = await AsyncStorage.getItem('LANGUAGE');
        if (!language) {
          language = globalLanguage;
        }
        if (language) {
          dispatch(setLanguage(language));
        }

        if (countryData) {
          dispatch(setCountry(countryCode.isoCode));
          //  dispatch(setCountryData(countryFound));
        }

        const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
        if (userToken) {
          dispatch(setUserToken(userToken));
        }
      } else {
        const country = RNLocalize.getCountry();

        const countryFound = countryList.find(
          (cn) => cn.isoCode === country.toLowerCase()
        );
        if (countryFound) {
          handleCountryData({
            countryFound,
          });
        } else {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'ChooseCountry', params: { footer: data } }],
          });
        }
      }
      Analytics_Events({
        eventName: 'Screen_View_Complete',
        EventToken: 'tpm40f',
        params: {
          screen_name: SCREEN_NAME_SPLASH,
          promotion_name: 'default',
          landed_from_url: navigateToDeeplinkOrUniversalLink,
          landed_from_push_notification: undefined,
        },
      });
    } catch (e) {
      console.warn(e);
      // error reading value
    }
  };

  const getLocationInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('countryCode');
      if (value !== null) {
        //  setCountryCode(value);
      }
    } catch (e) {
      console.warn(e);
      // error reading value
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <LottieView
        source={require('./logopb.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          aspectRatio:
            Dimensions.get('window').width / Dimensions.get('window').height,
        }}
      />
    </View>
  );
};
