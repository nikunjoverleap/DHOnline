import React from 'react';
import { ProductDetailsCarouselImageItem } from './ProductDetailsCarouselImageItem';
import Animated from 'react-native-reanimated';

export const ProductDetailsCarouselItem = (props) => {
  const {
    style,
    // row_index,
    index,
    pretty,
    productDetailItem,
    navigation,
    handle360Button,
    product,
    // screen_name,
    ...animatedViewProps
  } = props;

  return (
    <Animated.View style={{ flex: 1 }} {...animatedViewProps}>
      <ProductDetailsCarouselImageItem
        style={style}
        productDetailItem={productDetailItem}
        navigation={navigation}
        // row_index={row_index}
        widget_index={index}
        // screen_name={screen_name}
        product={product}
        index={index}
      />
    </Animated.View>
  );
};
