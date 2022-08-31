import React, { useMemo, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import Block from '../../../components/Block';
import WebView from 'react-native-webview';

function A1Component({
  otherProductFields,

  components,
}) {
  const [webViewHeight, setWebViewHeight] = useState();
  const data = otherProductFields?.[components?.config?.field];

  if (!data) {
    return null;
  }
  const A1ContentView = useMemo(() => {
    const onWebViewMessage = (event) => {
      setWebViewHeight(
        Number(event.nativeEvent.data) + (Platform.OS === 'ios' ? 400 : 0)
      );
    };
    return (
      <WebView
        style={{ height: webViewHeight }}
        scrollEnabled={false}
        source={{
          uri: data, // 'https://colorlib.com/etc/email-template/4/index.html',
          //   uri: 'https://reactnative.dev/',
        }}
        onMessage={onWebViewMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
      />
    );
  }, [data, webViewHeight]);
  return (
    <>
      <Block margin={[6.5, 0, 6.5, 0]} color={'white'}>
        {A1ContentView}
      </Block>
    </>
  );
}
export default A1Component;

const styles = StyleSheet.create({});
