import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Block from '../../../components/Block';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { espTransform } from '../../../components/PriceFormatFunction';
import UpdateProductQty from '../../../components/UpdateProductQty';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../../constants';
import colors from '../../../styles/colors';

function ProductPriceAndUpdateQty({
  productData,
  components,
  setProductCount = () => {},
  productCount,
}) {
  const [counter, setCounter] = useState(1);
  const labels = components?.componentData;
  const inventoryStocks =
    productData?.getProductDetailForMobile?.inventoryStock?.qty;
  const inStock =
    productData?.getProductDetailForMobile?.inventoryStock?.inStock;
  const stockThreshold = components?.componentData?.stockThreshold;

  const showStockQty =
    Number(inventoryStocks) < stockThreshold + 1 ? true : false;

  useEffect(() => {
    setCounter(productCount);
  }, [productCount]);

  return (
    productData?.getProductDetailForMobile?._id && (
      <Block
        flex={false}
        padding={[10, 15, 10, 15]}
        row
        between
        color={'white'}
      >
        <Block flex={false} width={'65%'}>
          {/* SKU Id text  */}
          <Text
            onPress={() =>
              Clipboard.setString(productData?.getProductDetailForMobile?._id)
            }
            style={styles.skuNumberText}
          >{`${components?.componentData?.skuTitle}: ${productData?.getProductDetailForMobile?._id}`}</Text>

          {/* Original and Discount price  */}
          <Block flex={false} row margin={[10, 0, 0, 0]} width={'100%'} center>
            <Block flex={false}>
              <Text style={styles.AEDText}>
                {productData?.getProductDetailForMobile?.selectedPrice
                  ?.currency || ''}{' '}
                {`${espTransform(
                  productData?.getProductDetailForMobile?.selectedPrice
                    ?.specialPrice || 0
                )}`}
              </Text>
            </Block>

            <Block flex={false} margin={[0, 0, 0, 15]}>
              <Text style={styles.discountPriceText}>
                {productData?.getProductDetailForMobile?.defaultPrice
                  ?.currency || ''}{' '}
                {`${espTransform(
                  productData?.getProductDetailForMobile?.defaultPrice
                    ?.specialPrice || 0
                )}`}
              </Text>
            </Block>
          </Block>

          {/* Saved Price */}
          <Text style={styles.youSavedText}>
            {components?.componentData?.youSavedTitle}{' '}
            <Text style={styles.savedPriceText}>
              {productData?.getProductDetailForMobile?.defaultPrice?.currency ||
                ''}{' '}
              {productData?.getProductDetailForMobile?.defaultPrice
                ?.specialPrice -
                productData?.getProductDetailForMobile?.selectedPrice
                  ?.specialPrice || 0}
            </Text>
          </Text>
        </Block>

        {/* Product Qty Increment and Decrement */}
        {inStock === true ? (
          <Block flex={false} width={'35%'}>
            {showStockQty ? (
              <Text style={styles.qtyText}>
                {labels.quantity}
                <Text style={styles.onlyLeftText}>
                  {labels?.quantityLeft?.replace(
                    '${currentStock}',
                    inventoryStocks
                  )}
                </Text>
              </Text>
            ) : null}
            <Block flex={false} margin={[10, 0, 0, 0]}>
              <UpdateProductQty
                counter={counter}
                onPlusPress={() => {
                  setCounter(counter + 1);
                  setProductCount(counter + 1);
                }}
                onMinusPress={() => {
                  setCounter(counter - 1);
                  setProductCount(counter - 1);
                }}
              />
            </Block>
            {/* <TouchableOpacity flex={false} style={styles.makeSetButtonView}>
          <Text style={styles.makeSetButtonText}>Make a Set</Text>
        </TouchableOpacity> */}
          </Block>
        ) : (
          <>
            {inStock === false ? (
              <View style={styles.outofStock}>
                <DanubeText
                  variant={TextVariants.XXXS}
                  mediumText
                  color={colors.black_2}
                >
                  Out of stock
                </DanubeText>
              </View>
            ) : null}
          </>
        )}
      </Block>
    )
  );
}
export default ProductPriceAndUpdateQty;

const styles = StyleSheet.create({
  skuNumberText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
  },
  discountPriceText: {
    color: '#989898',
    fontSize: 16,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textDecorationLine: 'line-through',
  },
  youSavedText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
  },
  savedPriceText: {
    color: '#424242',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  priceText: {
    color: '#D12E27',
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
  },
  AEDText: {
    color: '#D12E27',
    fontSize: 22,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  qtyText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
  },
  onlyLeftText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#424242',
  },

  minusPlusButtonView: {
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    height: 45,
    // width: 120,
    marginTop: 10,
  },
  plusButtonView: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButtonView: {
    // height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  qtyTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  minusButtonSize: {
    fontSize: 30,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  counterText: {
    fontSize: 18,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  plusButtonText: {
    fontSize: 20,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },

  makeSetButtonView: {
    backgroundColor: '#0A0A0A',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 40,
  },
  makeSetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  outofStock: {
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
});
