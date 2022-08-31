import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PostpayWidget } from 'react-native-postpay-widget';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import Block from '../../../components/Block';
import { Divider } from '../../../components/Divider';
import Text from '../../../components/Text';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../../constants';
import { ProductAttributes } from './ProductAttributes';

function PaymentWidget({ components, productData }) {
  const [postPayInfo, setPostPayInfo] = useState({
    widgetType: 'payment-summary',
    locale: 'en',
    numInstalments: 3,
    merchantId: 'id_c56705f1a9304e8c8a16e1da98ec8734',
    amount: '00',
    currency: 'AED',
    widgetUrl: 'https://widgets-dev.postpay.io',
  });

  useEffect(() => {
    postPayUpdateValue(
      'amount',
      productData?.selectedPrice?.specialPrice + '00'
    );
  }, [productData]);

  const postPayUpdateValue = (type, value) => {
    setPostPayInfo((pre) => ({ ...pre, [type]: value }));
  };

  return (
    <Block
      flex={false}
      padding={[15, 15]}
      margin={[15, 0, 0, 0]}
      color={'white'}
    >
      <Block flex={false} color={'rgb(248,247,240)'} padding={[10, 10, 15, 15]}>
        <PostpayWidget
          merchantId={postPayInfo?.merchantId}
          widgetType={postPayInfo?.widgetType}
          amount={postPayInfo?.amount}
          currency={postPayInfo?.currency}
          locale={postPayInfo?.locale}
          widgetUrl={postPayInfo?.widgetUrl}
          numInstalments={postPayInfo?.numInstalments}
        />
      </Block>
    </Block>
  );
}
export default PaymentWidget;

const styles = StyleSheet.create({
  optionTitleText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
    marginLeft: 10,
  },
});
