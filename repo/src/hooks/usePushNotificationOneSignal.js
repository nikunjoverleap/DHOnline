import { useEffect, useState } from 'react';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { LANDED_VIA_PUSH_NOTIFICATION, SCREEN_NAME_SPLASH } from '../constants';
import { Analytics_Events, handleDeepLinking, logInfo } from '../helper/Global';

import { URL } from 'react-native-url-polyfill';

const usePushNotificationOneSignal = (url) => {
  const navigation = useNavigation();

  const { country, language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const splash_screen = screenSettings[SCREEN_NAME_SPLASH];

  const DEEPLINK_CONFIG_DATA =
    splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;

  const handlePushNotification = () => {
    logInfo('NOTIFICATION:', notification);
    if (notification?.data?.payload?.deeplink) {
      const urlObj = new URL(url); // Just for gettng the query to object
      let urlKey = pathname.split('/')?.splice(3)?.join('/');

      // alert(JSON.stringify(notification?.data?.payload?.deeplink || {}));
      handleDeepLinking({
        country,
        language,
        deepLinkArray: DEEPLINK_CONFIG_DATA,
        subLink: urlObj.pathname,
        urlKey,
        navigation,
        via: LANDED_VIA_PUSH_NOTIFICATION,
        linkForLogging: url,
        queryString: urlObj.search,
        query: Object.fromEntries(urlObj.searchParams),
      });
    }
  };

  useEffect(() => {
    if (url) {
      handlePushNotification();
    }
  }, [url]);

  return {};
};
export default usePushNotificationOneSignal;
