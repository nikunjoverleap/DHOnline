import React from 'react';
import Block from '../Block';
import { OtherTags } from './OtherTags';
import { OfferTag } from './OfferTag';
import StyleSheetFactory from './ProductDetailCarouselStyle';

export const BottomRightTags = ({ otherProductFields }) => {
  let styles = StyleSheetFactory.getSheet();
  return (
    <Block style={styles?.bottomRightTagsContainer}>
      {otherProductFields.feature_badge ? (
        <OfferTag value={otherProductFields.feature_badge} />
      ) : null}

      {otherProductFields.sale_badge ? (
        <OtherTags value={otherProductFields.sale_badge} />
      ) : null}
    </Block>
  );
};
