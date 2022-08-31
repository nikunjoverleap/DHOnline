import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Block from '../../../components/Block';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import ZoomInIcon from '../../../../assets/svg/ZoomInIcon.svg';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

function ARModel({ otherProductFields, components, setOnLayout, productData }) {
  const ARModelURL = `${components?.config?.webviewUrl}`;
  const data = otherProductFields?.[components?.config?.field];

  if (!data) {
    return null;
  }
  const ARModelView = useMemo(() => {
    return (
      <WebView
        source={{
          uri: ARModelURL.replace(
            '{hello_ar_product_code}',
            data?.split(',')?.[0]
          ),
        }}
      />
    );
  }, [data]);
  return (
    <>
      <Block
        onLayout={(e) => {
          setOnLayout(e.nativeEvent.layout.y);
        }}
        flex={false}
        padding={[0, 10, 10, 10]}
        color={'white'}
        margin={[15, 0, 0, 0]}
      >
        <Block flex={false} margin={[15, 0, 0, 0]} height={250} width={'100%'}>
          {ARModelView}
        </Block>
        <Block
          flex={false}
          style={{ position: 'absolute', alignSelf: 'center' }}
          // height={250}
          width={'100%'}
          padding={[0, 0, 10, 0]}
          margin={[15, 0, 0, 0]}
        >
          <TouchableOpacity
            onPress={async () => {
              await InAppBrowser.open(
                ARModelURL.replace(
                  '{hello_ar_product_code}',
                  data?.split(',')?.[0]
                )
              );
            }}
            style={{
              alignSelf: 'flex-end',
              width: 25,
              height: 25,
              marginTop: 10,
              marginRight: 10,
            }}
          >
            <ZoomInIcon width={'100%'} height={'100%'} />
          </TouchableOpacity>
        </Block>

        <HTML
          contentWidth={width - 20}
          source={{ html: components?.componentData?.description }}
        />
      </Block>
    </>
  );
}
export default ARModel;

const styles = StyleSheet.create({});
