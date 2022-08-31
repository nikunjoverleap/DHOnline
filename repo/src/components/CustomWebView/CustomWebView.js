import React, { useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import {
  Dimensions,
  BackHandler,
  View,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
  Platform,
  I18nManager,
} from 'react-native';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import UserAgent from 'react-native-user-agent';
import cookie from 'cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../slicers/auth/authSlice';

export default CustomWebView = (props) => {
  const [showLoader, setShowLoader] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(`${props.url}`);
  const [userAgent, setUserAgent] = useState('');
  const [SelectedLanguage, setSelectedLanguage] = useState('');
  const dispatch = useDispatch();

  const webviewRef = useRef(null);

  useEffect(() => {
    const granted = PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    setUserAgent(UserAgent.getUserAgent());

    orderTrackingPermission();

    const backAction = () => {
      webviewRef.current.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    injectScript();
    return () => backHandler.remove();
  }, []);

  const orderTrackingPermission = async () => {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === 'not-determined') {
      const status = await requestTrackingPermission();
      if (status === 'authorized' || status === 'unavailable') {
        // enable tracking features
      }
    }
  };

  const injectScript = () => {
    const interval = setInterval(() => {
      webviewRef?.current?.injectJavaScript(runFirst);
    }, 1000);

    return () => clearInterval(interval);
  };

  const runFirst = `
  try {
    if(document.querySelector('.SocialSignInContainer')) {
     document.querySelector('.SocialSignInContainer').innerHTML='<div style={{height:60px}}></div>';
    }
    if(document.querySelector('.Footer')) {
    document.querySelector('.Footer').innerHTML='<div style={{height:60px}}></div>';
  }
  if(document.querySelector('.Navbar-Container')) {
    document.querySelector('.Navbar-Container').innerHTML='<div style={{display:none}}></div>';
  }
  if(document.querySelector('.Header_name_home')) {
    document.querySelector('.Header_name_home').innerHTML='<div style={{display:none}}></div>';
  }
  }catch(e) {
    console.log(e)
  } 
`;

  const CHECK_COOKIE = `
    if (window.ReactNativeWebView) {
      ReactNativeWebView.postMessage("Cookie: " + document.cookie);
    }
    true;
`;

  const onMessage = async (event) => {
    const { data } = event.nativeEvent;

    if (data.includes('store=ae_en')) {
      // setSelectedLanguage('ae_en');

      if (SelectedLanguage) {
        // await AsyncStorage.setItem('lang', 'ae_en');
        //  dispatch(setLanguage('ae_en'));
        // I18nManager.forceRTL(false);
        // RNRestart.Restart();
      }
    } else if (data.includes('store=ae_ar')) {
      // setSelectedLanguage('ae_ar');

      if (SelectedLanguage) {
        // await AsyncStorage.setItem('lang', 'ae_ar');
        // dispatch(setLanguage('ae_ar'));
        I18nManager.forceRTL(true);
        //  RNRestart.Restart();
      }
    }

    if (data.includes('Cookie:')) {
      const allCookies = cookie.parse(data);
      if (props.onJSCookieMessage) {
        props.onJSCookieMessage(allCookies);
      }
      // process the cookies
    }
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#B00009"
        barStyle={'dark-content'}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <WebView
          source={{ uri: currentUrl }}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
          sharedCookiesEnabled={true}
          overScrollMode="content"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowFileAccess={true}
          mediaPlaybackRequiresUserAction={false}
          cacheEnabled={true}
          androidHardwareAccelerationDisabled={true}
          javaScriptCanOpenWindowsAutomatically={true}
          scalesPageToFit={true}
          androidLayerType="hardware"
          mixedContentMode="always"
          contentMode="mobile"
          setBuiltInZoomControls={true}
          geolocationEnabled={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          onLoadStart={() => setShowLoader(true)}
          onLoad={() => setShowLoader(false)}
          ref={webviewRef}
          // injectedJavaScript={runFirst}
          decelerationRate="normal"
          onNavigationStateChange={(navState) => {
            webviewRef.current.canGoBack = navState.canGoBack;
            setCurrentUrl(navState.url);
            if (webviewRef.current) {
              webviewRef.current.injectJavaScript(CHECK_COOKIE);
            }
          }}
          userAgent={userAgent}
          applicationNameForUserAgent={
            Platform.OS === 'android'
              ? 'danubehomeonline/1.3'
              : 'danubehomeonline/1.2'
          }
          onMessage={onMessage}
          // userAgent={Platform.OS === 'android' ? 'Chrome/18.0.1025.133 Mobile Safari/535.19' : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'}
        />
      </SafeAreaView>
      {showLoader ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF0',
          }}
        >
          <ActivityIndicator size="large" color="#B00009" />
        </View>
      ) : null}
    </>
  );
};
