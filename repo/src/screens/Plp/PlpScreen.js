import * as React from 'react';
import { Text, View } from 'react-native';
import WebViewComponent from '../../components/CustomWebView/CustomWebView';
function PlpScreen({ route, navigation }) {
  const { url } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebViewComponent url={url} />
    </View>
  );
}
export default PlpScreen;
