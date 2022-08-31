import React, { useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
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

import UserAgent from 'react-native-user-agent';
import cookie from 'cookie';
import { setWebViewVisible } from '../../slicers/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_BAR_COLOR } from '../../constants';
import LogoCallBackSearchHeader from '../LogoCallBackSearchHeader';
import CommonHeader from '../LogoCallBackSearchHeader/CommonHeader';
import SimpleHeader from '../SimpleHeader';

export default WebViewComponent = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(`${props.url}`);
  const [userAgent, setUserAgent] = useState('');
  const { webViewVisibility, userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { ismyaccount, navigation } = props;

  const webviewRef = useRef(null);

  useEffect(() => {
    const granted = PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    setUserAgent(UserAgent.getUserAgent());

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

  injectScript = () => {
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
    if(document.querySelector('.AcceptCookie')) {
    document.querySelector('.AcceptCookie').style.display = 'none';
  }
  if(${!!userToken}) {
    window.localStorage.auth_token = JSON.stringify({"data":"${userToken}","expiration":31536000,"createdAt": ${new Date().getTime()}})
  }
  if(document.querySelector('.Navbar-Container')) {
    document.querySelector('.Navbar-Container').innerHTML='<div style={{display:none}}></div>';
  }
  if(document.querySelector('.Header_name_home')) {
    document.querySelector('.Header_name_home').innerHTML='<div style={{display:none}}></div>';
  }
  if(document.querySelector('.Header')){
    document.querySelector('.Header').innerHTML='<div style={{display:none}}></div>'
  }
  }catch(e) {
    console.log(e)
  }
`;

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML='<div style={{height:60px}}></div>';
  // document.querySelector('.SocialSignInContainer').innerHTML='<div style={{height:60px}}></div>';
  // document.querySelector('.SocialLogin-warp').innerHTML='<div style={{height:60px}}></div>';
  // true;`;

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML='<div style={{height:600px}}></div>';
  // document.querySelector('.SocialLogin-warp').innerHTML='<div style={{height:60px}}></div>';
  // document.querySelector('.MySocialAccount-Action').innerHTML='<div style={{height:60px}}></div>';
  // true;`;

  // //  document.getElementsByClassName('MySocialAccount-Action')[0].style.visibility='hidden';

  // const runFirst = `
  // document.querySelector('.Footer').innerHTML = "${props.route.params.footer?.cmsPage?.content}";
  // true;
  // `;
  const CHECK_COOKIE = `
    ReactNativeWebView.postMessage("Cookie: " + document.cookie);
    true;
`;
  const onMessage = (event) => {
    try {
      const { data } = event.nativeEvent;

      if (data.includes('Cookie:')) {
        const allCookies = cookie.parse(data);
        if (
          typeof props.onJSCookieMessage === 'function' &&
          props.onJSCookieMessage
        ) {
          props.onJSCookieMessage(allCookies);
        }
        // process the cookies
      }
    } catch (e) {
      console.warn(e);
    }
  };
  useEffect(() => {
    if (props.url !== currentUrl) {
      setCurrentUrl(props.url);
    }
  }, [props.url, webViewVisibility]);
  const [navSteps, setNavSteps] = useState(0);
  const handlePressBack = () => {
    if (navSteps === 0) {
      dispatch(
        setWebViewVisible({
          webViewVisibility: false,
        })
      );
    } else {
      setNavSteps(navSteps - 1);
      webviewRef.current.goBack();
    }
  };
  return (
    <>
      {/* {<CommonHeader onPressBack={handlePressBack} />} */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {ismyaccount && <SimpleHeader onPress={() => navigation.goBack()} />}
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
          // onLoadStart={() => setShowLoader(true)}
          // onLoad={() => setShowLoader(false)}
          ref={webviewRef}
          // injectedJavaScript={runFirst}
          decelerationRate="normal"
          onNavigationStateChange={(navState) => {
            webviewRef.current.canGoBack = navState.canGoBack;
            // setCurrentUrl(navState.url);
            const urlObj = new URL(navState.url);
            const currentUrlObj = new URL(currentUrl);
            if (urlObj.pathname !== currentUrlObj.pathname) {
              setNavSteps(navSteps + 1);
            }

            if (webviewRef.current) {
              webviewRef.current.injectJavaScript(CHECK_COOKIE);
            }
            if (
              [
                '/ae/ar',
                '/ae/en',
                '/kw/en',
                '/kw/ar',
                '/bh/en',
                '/bh/ar',
                '/om/en',
                '/om/ar',
                '/in/en',
                '/in/ar',
              ].includes(urlObj.pathname.replace(/\/+$/, ''))
            ) {
              setNavSteps(0);
              dispatch(
                setWebViewVisible({
                  webViewVisibility: false,
                })
              );
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
