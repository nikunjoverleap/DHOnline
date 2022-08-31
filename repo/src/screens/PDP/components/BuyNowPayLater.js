import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { espTransform } from '../../../components/PriceFormatFunction';
import colors from '../../../styles/colors';
const TIMES = 3;

const BuyNowPayLater = ({
  components,
  productData,
  productCount,
  groupProductsListData = [],
}) => {
  const isNormalProduct =
    productData?.getProductDetailForMobile?.type_id !== 'grouped' &&
    !productData?.getProductDetailForMobile?.groupedProducts?.length;

  const [sumOfSelectedPrice, setSumOfSelectedPrice] = useState();
  useEffect(() => {
    if (!isNormalProduct) {
      const sumOfSelectedPrice = groupProductsListData?.reduce(
        (total, currentValue) =>
          (total =
            total +
            currentValue?.selectedPrice?.specialPrice * currentValue?.qty),
        0
      );
      setSumOfSelectedPrice(sumOfSelectedPrice);
    }
  }, [groupProductsListData]);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { header = '', subHeader = '', postPay } = components?.componentData;
  const splittedAmount = isNormalProduct
    ? espTransform(
        (productData?.getProductDetailForMobile?.selectedPrice?.specialPrice *
          productCount) /
          TIMES
      )
    : espTransform(sumOfSelectedPrice / TIMES);
  const currency =
    productData?.getProductDetailForMobile?.selectedPrice?.currency || '';

  const mapObject = {
    '{currency}': currency || '',
    '{amount}': splittedAmount || '',
  };

  const processedDescription = postPay?.description?.replace(
    /{currency}|{amount}/gi,
    (matched) => mapObject?.[matched]
  );

  return (
    <View style={styles.margin}>
      <View style={styles.main}>
        <DanubeText
          mediumText
          variant={TextVariants.S}
          color={colors.black_3}
          style={styles.padding}
        >
          {header}
        </DanubeText>
        <DanubeText variant={TextVariants.XXXS} color={colors.grey_6}>
          {subHeader}
        </DanubeText>
        <View style={styles.postPay}>
          <SvgUri uri={postPay?.icon} />
          <View style={styles.description}>
            <DanubeText variant={TextVariants.XXS13}>
              {processedDescription}
            </DanubeText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BuyNowPayLater;

const styles = StyleSheet.create({
  postPay: {
    flexDirection: 'row',
    marginBottom: 22,
    marginTop: 17,
    alignItems: 'center',
  },
  padding: {
    paddingTop: 27,
    paddingBottom: 11,
  },
  main: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  description: {
    flex: 1,
    marginLeft: 7.92,
  },
  margin: {
    marginVertical: 6.5,
  },
});
