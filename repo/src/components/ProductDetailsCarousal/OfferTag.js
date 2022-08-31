import React from 'react';
import Block from '../Block';
import Text from '../Text';
import StyleSheetFactory from './ProductDetailCarouselStyle';

export const OfferTag = ({ style = {}, value }) => {
  let styles = StyleSheetFactory.getSheet();
  return (
    <Block
      flex={false}
      style={styles?.offerPriceContainer}
      padding={[0, 0, 0, 10]}
      width={80}
    >
      <Text style={[{ fontSize: 10, color: 'red' }, style]}>{value}</Text>
    </Block>
  );
};
