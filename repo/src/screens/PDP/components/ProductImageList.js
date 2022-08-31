import React from 'react';
import { StyleSheet, Text } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import { useSelector } from 'react-redux';
import Block from '../../../components/Block';
import ProductCardStyle from '../../../components/ProductCardCrossPlay/ProductCardStyle';
import { BottomRightTags } from '../../../components/ProductDetailsCarousal/BottomRightTags';
import { NewProductTag } from '../../../components/ProductDetailsCarousal/NewProductTag';
import ProductDetailCarouselStyle from '../../../components/ProductDetailsCarousal/ProductDetailCarouselStyle';
import ProductDetailsCarousel from '../../../components/ProductDetailsCarousal/ProductDetailsCarousel';
import { Three60View } from '../../../components/ProductDetailsCarousal/Three60View';

function ProductImageList({
  navigation,
  components,
  productData = {},
  style = {},
  handle360Button,
  otherProductFields,
}) {
  const { language } = useSelector((state) => state.auth);
  const badgeStyles = ProductCardStyle.getSheet(language);
  const productDetailCarouselStyle = ProductDetailCarouselStyle.getSheet();
  return (
    <>
      {components?.config?.showAsInPageSlider?.value === true && (
        <Block style={[{ width: '100%', height: '100%' }, style]}>
          <Block flex={false} width={'100%'} color={'white'} row center>
            <ProductDetailsCarousel
              product={productData?.getProductDetailForMobile?.media_gallery}
              navigation={navigation}
              handle360Button={handle360Button}
            />
          </Block>
          <Block style={{ position: 'absolute' }} width={'100%'}>
            {otherProductFields?.hello_ar_product_code ? (
              <Three60View handle360Button={handle360Button} />
            ) : null}

            {otherProductFields?.market_badge ? (
              <NewProductTag value={otherProductFields?.market_badge} />
            ) : null}
          </Block>
          {/* <BottomRightTags
            productData={productData}
            otherProductFields={otherProductFields}
            components={components}
          /> */}
          {otherProductFields?.discount_badge ? (
            <Block style={[badgeStyles.bottomBadgeSection, { bottom: 45 }]}>
              <ElevatedView elevation={0.2} style={[badgeStyles.discountBadge]}>
                <Text style={[badgeStyles.discountLabel]}>
                  {otherProductFields?.discount_badge}
                </Text>
              </ElevatedView>
            </Block>
          ) : null}
          {otherProductFields?.market_badge ? (
            <Block style={[badgeStyles.bottomBadgeSection, { bottom: 75 }]}>
              <ElevatedView elevation={0.2} style={[badgeStyles.marketBadge]}>
                <Text style={[badgeStyles.marketBadgeLabel]}>
                  {otherProductFields?.market_badge}
                </Text>
              </ElevatedView>
            </Block>
          ) : null}
          {otherProductFields?.feature_badge ? (
            <Block style={[badgeStyles.bottomBadgeSection, { bottom: 105 }]}>
              <ElevatedView elevation={0.2} style={[badgeStyles.featureBadge]}>
                <Text style={[badgeStyles.featureLabel]}>
                  {otherProductFields?.feature_badge}
                </Text>
              </ElevatedView>
            </Block>
          ) : null}
          <Block style={{ position: 'absolute' }}>
            {otherProductFields.sale_badge ? (
              <Block
                style={[badgeStyles.bottomBadgeSection, { top: 0 }]}
                width={'100%'}
              >
                <ElevatedView elevation={0.2} style={badgeStyles.saleBadge}>
                  <Text style={badgeStyles.saleBadgeLabel}>
                    {otherProductFields?.sale_badge}
                  </Text>
                </ElevatedView>
              </Block>
            ) : null}
          </Block>
        </Block>
      )}
    </>
  );
}
export default ProductImageList;

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
