import { useEffect, useState } from 'react';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';
import { useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useSelector } from 'react-redux';
import { LANDED_VIA_PUSH_NOTIFICATION, SCREEN_NAME_SPLASH } from '../constants';
import { Analytics_Events, handleDeepLinking, logInfo } from '../helper/Global';
import SmartechSDK from 'smartech-reactnative-module';
import { Platform } from 'react-native';

const usePushNotification = () => {
  const navigation = useNavigation();

  const { country, language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const splash_screen = screenSettings[SCREEN_NAME_SPLASH];

  const DEEPLINK_CONFIG_DATA =
    splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;

  const handlePushNotification = async () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        Adjust.setPushToken(token?.token);
        if (Platform.OS === 'android') {
          SmartechSDK.setDevicePushToken(token?.token);
        }

        if (token?.token) {
          Analytics_Events({
            eventName: 'AppPush_OptIn',
            params: {},
            EventToken: 'aex5wf',
          });
        } else {
          Analytics_Events({
            eventName: 'AppPush_OptOut',
            params: {},
            EventToken: 'br618t',
          });
        }
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        logInfo('NOTIFICATION:', notification);
        if (notification?.data?.payload?.deeplink) {
          const mainLink = notification?.data?.payload?.deeplink?.includes(
            '.com/'
          )
            ? notification?.data?.payload?.deeplink?.split('.com/')
            : notification?.data?.payload?.deeplink?.split('://');
          const subLink = '/' + mainLink?.[1].split('?__')[0];
          const urlKey = subLink.split(country + '/' + language + '/')[1];
          handleDeepLinking({
            deepLinkArray: DEEPLINK_CONFIG_DATA,
            subLink,
            urlKey,
            navigation,
            via: LANDED_VIA_PUSH_NOTIFICATION,
            linkForLogging: notification?.data?.payload?.deeplink,
          });
        }

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      senderID: '518182504998',
      popInitialNotification: true,
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        if (!__DEV__) {
          if (err.code !== 3010) {
            Analytics_Events({
              eventName: 'AppPush_OptOut',
              params: {},
              EventToken: 'br618t',
            });
          }
        }
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  useEffect(() => {
    handlePushNotification();
  }, []);

  return {};
};
export default usePushNotification;
