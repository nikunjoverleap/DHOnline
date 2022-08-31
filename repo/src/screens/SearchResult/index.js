import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import WebViewComponent from '../../components/CustomWebView/CustomWebView';

export default function SearchResult({ route }) {
  const { url } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <WebViewComponent url={url} />
      </View>
    </SafeAreaView>
  );
}
