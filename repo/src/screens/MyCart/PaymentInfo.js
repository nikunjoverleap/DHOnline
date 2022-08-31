import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import Block from '../../components/Block';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import { espTransform } from '../../components/PriceFormatFunction';
import { SCREEN_NAME_MY_CART } from '../../constants';
import colors from '../../styles/colors';
import PaymentContent from './components/PaymentContent';
import { BNPL } from './constants';
const PAYMENT_THRESHOLD = 10000;

const showLeftIcon = (paymentType, paymentIcons) => {
  switch (paymentType) {
    case 'tap':
      return <SvgUri uri={paymentIcons?.tap} style={styles.margin} />;
    case 'cashondelivery':
      return (
        <SvgUri uri={paymentIcons?.cashOnDelivary} style={styles.margin} />
      );
    case 'postpay':
      return <SvgUri uri={paymentIcons?.postPayLeft} style={styles.margin} />;
    case 'spotiipay':
      return <SvgUri uri={paymentIcons?.spotiLeft} style={styles.margin} />;
    default:
      return null;
  }
};
const showRightIcon = (paymentType, paymentIcons) => {
  switch (paymentType) {
    case 'postpay':
      return <SvgUri uri={paymentIcons?.postPayRight} />;
    case 'spotiipay':
      return <SvgUri uri={paymentIcons?.spotiRight} />;
    default:
      return null;
  }
};

const showDetails = (paymentType, labels, cartData) => {
  const dividedAmount = cartData?.subtotal_with_discount / 3 || ' ';
  const correctedAmount = `${espTransform(dividedAmount || 0)}`;
  const currencyCode = cartData?.base_currency_code || ' ';
  const amoutWithCountryCode = `${currencyCode} ${correctedAmount}`;

  switch (paymentType) {
    case 'postpay':
      return (
        <View style={styles.subPadding}>
          <DanubeText color={colors.black_3} variant={TextVariants.XXS}>
            {labels?.postPay?.postPayHeader?.replace(
              '${amount}',
              amoutWithCountryCode
            )}
          </DanubeText>
        </View>
      );
    case 'spotiipay':
      return (
        <View style={styles.subPadding}>
          <DanubeText color={colors.black_3} variant={TextVariants.XXS}>
            {labels?.spotii?.spotiiHeader?.replace(
              '${amount}',
              amoutWithCountryCode
            )}
          </DanubeText>
        </View>
      );
    default:
      return null;
  }
};

const PaymentInfo = ({
  item,
  index,
  selectedPaymentMethod,
  selectOtherPaymentMethod = () => {},
  handleCreditCardOnChange,
  paymentIcons,
  cardError = '',
  expiryDateError = '',
  cvvError = '',
}) => {
  const { cartItems } = useSelector((state) => state.cart);
  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const bnplDataAndLabels = myCartData?.[BNPL]?.componentData;
  const { postPay = {}, spotii = {} } = bnplDataAndLabels;

  return (
    <>
      {cartItems?.cartData?.subtotal_with_discount > PAYMENT_THRESHOLD &&
      item?.code === 'postpay' ? null : (
        <View style={styles.padding}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => selectOtherPaymentMethod(index, item)}
          >
            <Block flex={false} selfcenter padding={[0, 14.27, 0, 0]}>
              <View
                height={17}
                width={17}
                center
                middle
                style={[
                  styles.unSelectedCircleView,
                  index === selectedPaymentMethod && {
                    backgroundColor: colors.black,
                  },
                ]}
              />
            </Block>
            <Block flex={false} selfcenter>
              {showLeftIcon(item?.code, paymentIcons)}
            </Block>

            <Block flex={false} selfcenter>
              <DanubeText variant={TextVariants.XS} color={colors.black}>
                {item?.title}
              </DanubeText>
            </Block>
            <Block flex={false} selfcenter margin={[0, 0, 0, 5]}>
              {showRightIcon(item?.code, paymentIcons)}
            </Block>
          </TouchableOpacity>
          {showDetails(item?.code, bnplDataAndLabels, cartItems?.cartData)}
        </View>
      )}

      {index === selectedPaymentMethod &&
      item?.code === 'spotiipay' &&
      cartItems?.cartData?.subtotal_with_discount < PAYMENT_THRESHOLD ? (
        <PaymentContent
          steps={spotii?.steps}
          color={colors.orange}
          footer={spotii?.spotiiFooter || ''}
        />
      ) : null}
      {index === selectedPaymentMethod &&
      item?.code === 'postpay' &&
      cartItems?.cartData?.subtotal_with_discount < PAYMENT_THRESHOLD ? (
        <PaymentContent
          steps={postPay?.steps}
          color={colors.sky_blue}
          footer={postPay?.postPayFooter || ''}
        />
      ) : null}
      {item.code === 'payfort_fort_cc' && index === selectedPaymentMethod ? (
        <View style={{ marginBottom: 21 }}>
          <CreditCardInput
            onChange={handleCreditCardOnChange}
            additionalInputsProps={{
              number: {
                style: {
                  backgroundColor: colors.grey_10,
                  height: 52,
                  borderRadius: 4,
                  paddingHorizontal: 15,
                },
                placeholderTextColor: '#949494',
                placeholder: 'Card Number*', // TODO Translation
                error: cardError,
              },
              expiry: {
                style: {
                  backgroundColor: colors.grey_10,
                  height: 52,
                  marginRight: 5,
                  borderRadius: 4,
                  paddingHorizontal: 15,
                  marginTop: 10,
                },
                placeholderTextColor: '#949494',
                placeholder: 'Expiry Date*', // TODO Translation
                error: expiryDateError,
              },
              cvc: {
                style: {
                  backgroundColor: colors.grey_10,
                  height: 52,
                  marginLeft: 5,
                  borderRadius: 4,
                  paddingHorizontal: 15,
                  marginTop: 10,
                },
                placeholderTextColor: '#949494',
                placeholder: 'CVV*', // TODO Translation
                error: cvvError,
              },
            }}
          />
        </View>
      ) : null}
      <View style={{ height: 1, backgroundColor: colors.grey_12 }}></View>
    </>
  );
};
export default PaymentInfo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  unSelectedCircleView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.black,
  },
  selectedCircleView: {
    borderRadius: 10,
  },
  margin: {
    marginRight: 8,
  },
  padding: {
    paddingBottom: 17,
    paddingTop: 21,
  },
  subPadding: {
    paddingLeft: 31.27,
    paddingTop: 6,
  },
});
