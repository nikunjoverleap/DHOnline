import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { useSelector } from 'react-redux';

export const GlobalOffersBanner = ({ components, productData }) => {
  const { country } = useSelector((state) => state.auth);
  const [optionList, setOptionList] = useState(
    components?.componentData?.[country]
  );
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.imageView}
        onPress={async () => {
          await InAppBrowser.open(optionList?.onPress);
        }}
      >
        <Image
          style={styles.imageStyle}
          source={{
            uri: optionList?.bannerImageLink,
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    width: '100%',
    height: 80,
    marginVertical: 6.5,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
  },
});
