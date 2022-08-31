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
} from 'react-native';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import UserAgent from 'react-native-user-agent';

export default OldHomeScreen = (props) => {
  const [showLoader, setShowLoader] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(
    props.route.params.countryCode === 'in/en/'
      ? `https://in.danubehome.com/`
      : `https://danubehome.com/${props.route.params.countryCode}`
  );
  const [userAgent, setUserAgent] = useState('');

  const webviewRef = useRef(null);

  useEffect(() => {
    const granted = PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    setUserAgent(UserAgent.getUserAgent());

    console.log(UserAgent.getUserAgent(), 'UserAgent.getUserAgent()');

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

  orderTrackingPermission = async () => {
    const trackingStatus = await getTrackingStatus();
    console.log(trackingStatus, 'trackingStatus');
    if (trackingStatus === 'not-determined') {
      const status = await requestTrackingPermission();
      if (status === 'authorized' || status === 'unavailable') {
        // enable tracking features
      }
    }
  };

  injectScript = () => {
    const interval = setInterval(() => {
      webviewRef?.current?.injectJavaScript(runFirst);
    }, 1000);

    return () => clearInterval(interval);
  };

  // const runFirst = `
  //     document.querySelector('.mobile-store').style.display = 'none';
  //     document.querySelector('.Footer-block').style.display = 'none';
  //     document.querySelector('.Footer-newsletter').style.display = 'none';
  //     document.querySelector('.Footer').style.display = 'none';
  //     true; // note: this is required, or you'll sometimes get silent failures
  //   `;

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML='<div style={{height:60px}}></div>';
  // true;`;

  const runFirst = `
  document.querySelector('.Footer').innerHTML='<div style={{height:60px}}></div>';
  document.querySelector('.SocialSignInContainer').innerHTML='<div style={{height:60px}}></div>';
  document.querySelector('.SocialLogin-warp').innerHTML='<div style={{height:60px}}></div>';
  true;`;

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML='<div style={{height:600px}}></div>';
  // document.querySelector('.SocialLogin-warp').innerHTML='<div style={{height:60px}}></div>';
  // document.querySelector('.MySocialAccount-Action').innerHTML='<div style={{height:60px}}></div>';
  // true;`;

  //   document.getElementsByClassName('MySocialAccount-Action')[0].style.visibility='hidden';

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML = "${props.route.params.footer?.cmsPage?.content}";
  // true;
  // `;

  return (
    <>
      <StatusBar animated={true} backgroundColor="#B00009" />
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
          onMessage={(event) => {}}
          ref={webviewRef}
          // injectedJavaScript={runFirst}
          decelerationRate="normal"
          onNavigationStateChange={(navState) => {
            webviewRef.current.canGoBack = navState.canGoBack;
            setCurrentUrl(navState.url);

            console.log(navState, 'navState');
          }}
          userAgent={userAgent}
          applicationNameForUserAgent={
            Platform.OS === 'android'
              ? 'danubehomeonline/1.3'
              : 'danubehomeonline/1.2'
          }
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
