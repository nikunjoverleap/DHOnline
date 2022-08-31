import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import StyleSheetFactory from '../PlpStyle';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
const { width, height } = Dimensions.get('window');

const deviceAspectRatio = width / height;
export default PlpBanner = ({
  uri,
  height = 60,
  targetLink,
  navigation,
} = {}) => {
  if (!uri) {
    return null;
  }
  const { language } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  return (
    <TouchableOpacity
      activeOpacity={targetLink ? 0.5 : 0.9}
      onPress={() => {
        if (targetLink) {
          navigation.navigate(targetLink);
        }
      }}
    >
      <FastImage
        style={[styles.PlpBannerImg, { height: deviceAspectRatio * height }]}
        // resizeMode="stretch"
        source={{
          uri,
        }}
      />
    </TouchableOpacity>
  );
};
