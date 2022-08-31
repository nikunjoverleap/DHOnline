import { useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import WebViewComponent from '../../components/WebView/WebViewComponent';
import { CREATE_EMPTY_CART } from '../../helper/gql';
import { setPWAGuestToken, setPWATokens } from '../../slicers/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEmptyCart } from './actions';
import {
  DH_ONLINE_PWA_GUEST_TOKEN,
  DH_ONLINE_USER_TOKEN,
} from '../../constants';

const { width } = Dimensions.get('window');
function InvisibleScreen({ url = 'https://danubehome.com' }) {
  const dispatch = useDispatch();
  const { pwaGuestToken, userToken } = useSelector((state) => state.auth);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimHeight = useRef(new Animated.Value(0)).current;

  const fadeInAnimHeight = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnimHeight, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  const fadeOutAnimHeight = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnimHeight, {
      toValue: width + 100,
      duration: 500,
    }).start();
  };
  const handlePWAAuthCookies = (cookies) => {
    // dispatch(setPWATokens(cookies));
  };

  useEffect(() => {
    checkIsTokenAvailable();
  }, []);

  const checkIsTokenAvailable = async () => {
    const currentUserToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
    if (!currentUserToken) {
      const currentPwaGuestToken = await AsyncStorage.getItem(
        DH_ONLINE_PWA_GUEST_TOKEN
      );
      dispatch(setPWAGuestToken(currentPwaGuestToken));
      if (currentPwaGuestToken) {
      } else {
        const viewCartForCustomer = await createEmptyCart();
        await AsyncStorage.setItem(
          DH_ONLINE_PWA_GUEST_TOKEN,
          viewCartForCustomer?.createEmptyCart
        );
        dispatch(setPWAGuestToken(viewCartForCustomer?.createEmptyCart));
      }
    }
  };

  const { webViewVisibility, webviewAppUrl, country, language } = useSelector(
    (state) => state.auth
  );
  const [localStateWebViewAppUrl, setWebViewUrl] = useState(webviewAppUrl);
  useEffect(() => {
    if (localStateWebViewAppUrl !== webviewAppUrl) {
      setWebViewUrl(webviewAppUrl);
    }
  }, [language, webviewAppUrl]);

  useEffect(() => {
    if (webViewVisibility) {
      setTimeout(() => {
        fadeInAnimHeight();
      }, 300);
    } else {
      fadeOutAnimHeight();
    }
  }, [webViewVisibility]);
  if (!country || !language) {
    return null;
  }
  return (
    <Animated.View
      style={[
        styles.fadingContainer,
        {
          // height: webViewVisibility ? undefined : 0,
          position: 'absolute',
          // Bind opacity to animated value
          //  opacity: fadeAnim,
          left: fadeAnimHeight,
        },
      ]}
    >
      {/* style={{
        position: 'absolute',
        overflow: webViewVisibility ? 'visible' : 'hidden',
        maxHeight: webViewVisibility ? undefined : 0,
        maxWidth: webViewVisibility ? undefined : 0,
        flex: 1,
        // animationIn: 'slideInLeft',
        // animationOut: 'slideOutRight',
      }}
    > */}
      {/* <Modal
      animationType="slide"
      transparent={true}
      visible={webViewVisibility}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        //setModalVisible(!modalVisible);
      }}
    > */}
      <WebViewComponent
        url={localStateWebViewAppUrl}
        onJSCookieMessage={handlePWAAuthCookies}
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 0,
    backgroundColor: 'powderblue',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default InvisibleScreen;
