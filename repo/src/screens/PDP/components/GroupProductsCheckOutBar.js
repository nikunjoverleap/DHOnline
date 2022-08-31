import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '../../../components/Block';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { espTransform } from '../../../components/PriceFormatFunction';
import {
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_REGULAR,
} from '../../../constants';
import { logInfo } from '../../../helper/Global';
import colors from '../../../styles/colors';

export const GroupProductsCheckOutBar = ({
  componentName,
  productData,
  handleAddToCartButton,
}) => {
  const currency = productData?.[0]?.defaultPrice?.currency;
  // const { groupProduct } = useSelector((state) => state.pdp);
  const [sumOfSelectedPrice, setSumOfSelectedPrice] = useState();
  const [sumOfDefaultPrice, setSumOfDefaultPrice] = useState();
  const [youSaved, setYouSaved] = useState();
  const [seaterLabel, setSeaterLabel] = useState('');
  const { language } = useSelector((state) => state.auth);

  useEffect(() => {
    let customString = '';
    productData?.map((el) => {
      for (let index = 0; index < el?.qty; index++) {
        customString =
          customString !== '' && el?.seaterLabel
            ? `${customString} + ${el?.seaterLabel}`
            : `${el?.seaterLabel}`;
      }
    });
    setSeaterLabel(customString);
    const sumOfSelectedPrice = productData?.reduce(
      (total, currentValue) =>
        (total =
          total +
          currentValue?.selectedPrice?.specialPrice * currentValue?.qty),
      0
    );

    const sumOfDefaultPrice = productData?.reduce(
      (total, currentValue) =>
        (total =
          total + currentValue?.defaultPrice?.specialPrice * currentValue?.qty),
      0
    );
    setSumOfSelectedPrice(sumOfSelectedPrice);
    setSumOfDefaultPrice(sumOfDefaultPrice);
    setYouSaved(sumOfDefaultPrice - sumOfSelectedPrice);
  }, [productData]);

  logInfo(productData, 'productData-productData999');

  const addToCartHandler = () => {
    productData?.map((item) => {
      if (item?.qty > 0) {
        handleAddToCartButton(
          { ...item, type_id: 'simple' },
          item?.qty,
          true,
          true
        );
      }
    });
  };

  return (
    <View style={styles.shadow}>
      <Block
        flex={false}
        row
        padding={[11, 15, 20, 15]}
        center
        // padding={[10]}
        // style={styles.mainView}
        style={{ backgroundColor: '#fff' }}
      >
        {sumOfDefaultPrice > 0 ? (
          <>
            <Block flex={false} width={'50%'}>
              {/* SKU Id text  */}
              <Text style={styles.skuNumberText}>
                {seaterLabel}
                {seaterLabel ? ' Seater at' : null}{' '}
                {/** TODO LABEL SHOUD COME FROM CONTENTFUL */}
                {/* TODO based on the products, to be configured at contentful */}
              </Text>

              {/* Original and Discount price  */}
              <Block flex={false} row width={'100%'}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <DanubeText variant={TextVariants.XS}>{currency} </DanubeText>
                  <DanubeText
                    bold
                    variant={TextVariants.Base}
                    color={colors.red_2}
                  >{`${espTransform(sumOfSelectedPrice)}`}</DanubeText>
                  <DanubeText style={styles.strike} color={colors.grey_4} light>
                    {currency} {`${espTransform(sumOfDefaultPrice)}`}
                  </DanubeText>
                </View>
              </Block>

              {/* Saved Price */}
              <Text
                style={[
                  styles.youSavedText,
                  {
                    fontFamily:
                      language === 'ar'
                        ? FONT_FAMILY_ARABIC_REGULAR
                        : FONT_FAMILY_ENGLISH_REGULAR,
                  },
                ]}
              >
                {'You saved'} {/** TODO LABEL SHOUD COME FROM CONTENTFUL */}
                <Text style={styles.savedPriceText}>
                  {currency} {`${espTransform(youSaved)}`}
                </Text>
              </Text>
            </Block>
          </>
        ) : (
          <Block flex={false} width={'50%'}>
            <Text style={[styles.AEDText, { color: '#333333' }]}>
              Please choose one item{' '}
              {/** TODO LABEL SHOUD COME FROM CONTENTFUL */}
            </Text>
          </Block>
        )}

        {componentName === 'GROUPED_PRODUCTS' ? (
          <TouchableOpacity
            style={{
              width: '48%',
              backgroundColor: '#000000',
              paddingVertical: 15,
              alignItems: 'center',
              borderRadius: 5,
            }}
            onPress={() => {
              if (sumOfDefaultPrice > 0) {
                addToCartHandler();
              }
              // navigation.navigate('My Cart');
            }}
          >
            <Text
              style={[
                styles.buyThisSetText,
                sumOfDefaultPrice > 0 ? {} : { color: '#fff3' },
              ]}
            >
              BUY THIS SET {/** TODO LABEL SHOUD COME FROM CONTENTFUL */}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              width: '48%',
              paddingVertical: 15,
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: '#000000',
              borderRadius: 5,
            }}
          >
            <Text style={styles.addToCartText}>ADD TO CARD</Text>{' '}
            {/** TODO LABEL SHOUD COME FROM CONTENTFUL */}
          </TouchableOpacity>
        )}
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  addToCartTextView: {
    height: 45,
    width: '60%',
    backgroundColor: '#2F2F2F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  addToCartText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  buyThisSetText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  minusText: {
    fontSize: 30,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  PlusText: {
    fontSize: 20,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  minusPlusButtonView: {
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    height: 45,
    marginHorizontal: 10,
  },
  plusButtonView: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  qtyTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  counterText: {
    fontSize: 18,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },

  skuNumberText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
  },
  strike: {
    textDecorationLine: 'line-through',
    left: 10,
    fontSize: 13,
  },
  youSavedText: {
    fontSize: 14,
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
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  AEDText: {
    color: '#D12E27',
    fontSize: 15,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
});
