import * as React from 'react';
import { View } from 'react-native';
import WebViewComponent from '../../../components/WebView/WebViewComponent';

function MyAccountWebView({ route, navigation }) {
  const { url } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <WebViewComponent url={url} navigation={navigation} ismyaccount={true} />
    </View>
  );
}

export default MyAccountWebView;
