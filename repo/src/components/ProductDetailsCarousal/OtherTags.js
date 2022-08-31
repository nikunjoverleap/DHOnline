import React from 'react';
import Block from '../Block';
import Text from '../Text';
import StyleSheetFactory from './ProductDetailCarouselStyle';

export const OtherTags = ({ value }) => {
  let styles = StyleSheetFactory.getSheet();
  return (
    <Block
      margin={[10, 0, 40, 0]}
      padding={[0, 10]}
      style={styles?.otherTagsContainer}
    >
      <Text style={{ fontSize: 10 }}>{value}</Text>
    </Block>
  );
};
