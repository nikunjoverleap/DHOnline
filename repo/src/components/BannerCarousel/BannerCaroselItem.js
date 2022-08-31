import React from 'react';
import { BannerCaroselImageItem } from './BannerCaroselImageItem';
import Animated from 'react-native-reanimated';

export const BannerCaroselItem = (props) => {
  const {
    style,
    row_index,
    index,
    pretty,
    bannerItem,
    navigation,
    screen_name,
    ...animatedViewProps
  } = props;
  return (
    <Animated.View style={{ flex: 1 }} {...animatedViewProps}>
      <BannerCaroselImageItem
        style={style}
        bannerItem={bannerItem}
        navigation={navigation}
        row_index={row_index}
        widget_index={index}
        screen_name={screen_name}
      />
    </Animated.View>
  );
};
