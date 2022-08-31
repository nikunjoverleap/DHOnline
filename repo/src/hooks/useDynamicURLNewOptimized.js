import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';
import isEmpty from 'lodash.isempty';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  LANDED_VIA_DEEPLINK,
  LANDED_VIA_UNIVERSAL_LINK,
  SCREEN_NAME_PDP,
  SCREEN_NAME_SPLASH,
} from '../constants';
import { handleDeepLinking, logError, logInfo } from '../helper/Global';
import { handleDeeplink } from '../helper/handleDeeplink';

const handleDynamicLink = ({
  link,
  navigation,
  setLinkingURL,
  DEEPLINK_CONFIG_DATA,
  country,
  language,
}) => {
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
const initializeAdjust = ({
  navigation,
  DEEPLINK_CONFIG_DATA,
  country,
  language,
}) => {
  const adjustConfig = new AdjustConfig(
    'bv6qphknkrgg',
    AdjustConfig.EnvironmentSandbox
  );
  adjustConfig.setShouldLaunchDeeplink(true);
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

  Adjust.create(adjustConfig);
};

const useDynamicURL = () => {
  const navigation = useNavigation();
  const { country, language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const [linkingURL, setLinkingURL] = useState('');
  const splash_screen = screenSettings[SCREEN_NAME_SPLASH];

  const DEEPLINK_CONFIG_DATA =
    splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;

  const getInitialUrl = async () => {
    try {
      const url = await Linking.getInitialURL();
      handleDynamicLink({
        link: { url },
        setLinkingURL,
        navigation,
        DEEPLINK_CONFIG_DATA,
        country,
        language,
      });
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    initializeAdjust({ navigation, country, language, DEEPLINK_CONFIG_DATA });
    if (DEEPLINK_CONFIG_DATA) {
      getInitialUrl();
      Linking.addEventListener('url', (link) => {
        handleDynamicLink({
          link,
          navigation,
          setLinkingURL,
          DEEPLINK_CONFIG_DATA,
          country,
          language,
        });
      });
    }

    return () => Linking.removeAllListeners('url', handleDynamicLink);
  }, [DEEPLINK_CONFIG_DATA]);

  return { linkingURL };
};
export default useDynamicURL;
