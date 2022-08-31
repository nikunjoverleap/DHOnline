import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import PostPay from '../../../../assets/svg/post_pay.svg';
import SpotiIcon from '../../../../assets/svg/spoti.svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { SCREEN_NAME_MY_CART } from '../../../constants';
import colors from '../../../styles/colors';
import { BNPL } from '../constants';
import PayCard from './PayCard';

const BuyNowPayLater = () => {
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const bnplDataAndLabels = myCartData?.[BNPL]?.componentData;

  const {
    header = '',
    subHeader = '',
    postPay = {},
    spotii = {},
  } = bnplDataAndLabels;
  return (
    <View style={{ backgroundColor: colors.grey_10, paddingTop: 6.5 }}>
      <View style={styles.main}>
        <DanubeText
          variant={TextVariants.S}
          color={colors.black_3}
          mediumText
          style={styles.header}
        >
          {header}
        </DanubeText>
        <DanubeText
          variant={TextVariants.XXS}
          color={colors.grey_6}
          style={styles.subLabel}
        >
          {subHeader}
        </DanubeText>
        <PayCard
          label={postPay?.postPayHeader || ''}
          subLabel={postPay?.postPaySubHeader || ''}
          icon={<PostPay />}
          borderColor={colors.sky_blue}
          color={colors.sky_blue}
          steps={postPay?.steps}
          footer={postPay?.postPayFooter || ''}
          amountPerMonth={24}
          currencyCode={`${cartItems?.cartData?.base_currency_code || ''}`}
          devidedAmount={`${
            cartItems?.cartData?.subtotal_with_discount / 3 || ' '
          }`}
        />
        <View style={styles.space} />
        <PayCard
          label={spotii?.spotiiHeader || ''}
          subLabel={spotii?.spotiiSubHeader || ''}
          icon={<SpotiIcon />}
          borderColor={colors.orange}
          color={colors.orange}
          steps={spotii?.steps}
          footer={spotii?.spotiiFooter || ''}
          amountPerMonth={23}
          currencyCode={`${cartItems?.cartData?.base_currency_code || ''}`}
          //  check subtotal with discount always there
          devidedAmount={`${
            cartItems?.cartData?.subtotal_with_discount / 3 || ' '
          }`}
        />
      </View>
    </View>
  );
};

export default BuyNowPayLater;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: 25,
    marginBottom: 9,
  },
  subLabel: {
    marginBottom: 14,
  },
  space: {
    height: 31.25,
  },
});
