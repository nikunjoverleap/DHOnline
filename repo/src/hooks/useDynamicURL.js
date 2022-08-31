import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Linking } from 'react-native';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';
import isEmpty from 'lodash.isempty';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import QuickActions from 'react-native-quick-actions';
import {
  LANDED_VIA_DEEPLINK,
  LANDED_VIA_UNIVERSAL_LINK,
  SCREEN_NAME_PDP,
  SCREEN_NAME_SPLASH,
} from '../constants';
import { handleDeepLinking, logError, logInfo } from '../helper/Global';
import { handleDeeplink } from '../helper/handleDeeplink';

const adjustConfig = new AdjustConfig(
  'bv6qphknkrgg',
  AdjustConfig.EnvironmentSandbox
);

adjustConfig.setShouldLaunchDeeplink(true);
Adjust.create(adjustConfig);

const useDynamicURL = () => {
  const navigation = useNavigation();
  const { country, language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const splash_screen = screenSettings[SCREEN_NAME_SPLASH];

  const DEEPLINK_CONFIG_DATA =
    splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;

  adjustConfig.setDeferredDeeplinkCallbackListener(function (deeplink) {
    logInfo('Deferred deep link URL content: ' + deeplink);
    handleDeeplink({
      url: deeplink,
      country,
      language,
      DEEPLINK_CONFIG_DATA,
      navigation,
    });
  });

  const [linkingURL, setLinkingURL] = useState('');
  const handleDynamicLink = (link) => {
    if (link?.url !== null) {
      const isAdjustDeepLink = link?.url?.includes('adj.st/');
      let via =
        (link?.url?.includes('.com/') && LANDED_VIA_UNIVERSAL_LINK) ||
        LANDED_VIA_DEEPLINK ||
        isAdjustDeepLink;
      let mainLink = link?.url?.includes('.com/')
        ? link?.url?.split('.com/')
        : isAdjustDeepLink
        ? link?.url?.split('adj.st/')
        : link?.url?.split('://');

      setLinkingURL(mainLink);

      let subLink = '/' + mainLink?.[1];
      if (isAdjustDeepLink) {
        subLink = subLink?.split('?')?.[0];
      }
      console.log('subLink==== ', subLink);

      // danubehomeonline://ae/en/elaine-ceramic-table-lamp-13-26-5cm-offwhite
      const urlKey = subLink.split(country + '/' + language + '/')[1];
      handleDeepLinking({
        deepLinkArray: DEEPLINK_CONFIG_DATA,
        subLink,
        urlKey,
        navigation,
        via,
        linkForLogging: link?.url,
      });

      Adjust.appWillOpenUrl(link.url);
    }
  };

  const getInitialUrl = async () => {
    try {
      const url = await Linking.getInitialURL();
      handleDynamicLink({ url });
    } catch (error) {
      logError(error);
    }
  };
  function doSomethingWithTheAction(data) {
    console.log('quickActionShortcut', data?.title);
    console.log('quickActionShortcut', data?.type);
    console.log('quickActionShortcut', data?.linkInfo);
    if (data?.linkInfo) {
      handleDynamicLink({ link: data.linkInfo });
    }
  }
  useEffect(() => {
    QuickActions.clearShortcutItems();
    QuickActions.setShortcutItems([
      {
        type: 'Orders', // Required
        title: 'My Orders', // Optional, if empty, `type` will be used instead
        subtitle: '',
        // icon: 'Compose', // Icons instructions below
        linkInfo: {
          //  url: 'danubehomeonline://ae/en/myaccount', // Provide any custom data like deep linking URL
          url: `danubehomeonline://ae/en/cart`,
        },
      },
    ]);
    DeviceEventEmitter.addListener('quickActionShortcut', (data) => {
      console.log('quickActionShortcut', data?.title);
      console.log('quickActionShortcut', data?.type);
      console.log('quickActionShortcut', data?.linkInfo);
      if (data?.linkInfo) {
        handleDynamicLink({ link: data.linkInfo });
      }
    });
    QuickActions.popInitialAction()
      .then(doSomethingWithTheAction)
      .catch(console.error);
    getInitialUrl();
    Linking.addEventListener('url', handleDynamicLink);

    return () => Linking.removeAllListeners('url', handleDynamicLink);
  }, []);

  return { linkingURL };
};
export default useDynamicURL;
