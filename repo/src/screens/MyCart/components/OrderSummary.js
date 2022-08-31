import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import Seperator from '../../../components/Seperator';
import colors from '../../../styles/colors';
import ChargeItem from './ChargeItem';

const OrderSummary = ({
  SubTotalAmount,
  cartData,
  orderSummaryLabels,
  isFromCart = false,
  isCashonDelivery = false,
}) => {
  const {
    header = '',
    subHeader = '',
    sections = [],
    footerLabel = '',
    subFooterLabel = '',
  } = orderSummaryLabels;
  return (
    <View style={{ backgroundColor: colors.grey_10, paddingBottom: 6.5 }}>
      <View style={styles.main}>
        <DanubeText
          mediumText
          variant={TextVariants.S}
          style={styles.header}
          color={colors.black_3}
        >
          {header}
        </DanubeText>
        <View style={styles.subtotal}>
          <DanubeText mediumText style={styles.label}>
            {subHeader}
          </DanubeText>
          <DanubeText mediumText style={styles.price}>
            {SubTotalAmount}
          </DanubeText>
        </View>
        {sections?.map((item, index) => {
          return (
            <ChargeItem
              item={item}
              isCashonDelivery={isCashonDelivery}
              conditions={item?.conditions}
              key={item?.id + index}
              hideInCart={item?.hideInCart}
              isFromCart={isFromCart}
              additionalData={item?.additionalData}
              icon={item?.icon}
              onIconPress={() => {}}
              label={item?.label}
              amount={`${cartData?.base_currency_code || ''} ${_.get(
                cartData,
                item?.id,
                ''
              )}`}
              couponCode={cartData?.coupon_code}
              price={_.get(cartData, item?.id, 0)}
            />
          );
        })}

        <Seperator extraStyle={styles.seperator} />
        <View style={styles.footer}>
          <View>
            <DanubeText variant={TextVariants.Base} mediumText>
              {footerLabel}
            </DanubeText>
            <DanubeText style={styles.subLabel}>({subFooterLabel})</DanubeText>
          </View>
          <DanubeText variant={TextVariants.Base} mediumText>
            {cartData?.base_currency_code || ''} {cartData?.grand_total}
          </DanubeText>
        </View>
      </View>
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 18,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: 22,
    marginBottom: 21,
  },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
  subContainer: {
    marginTop: 13,
  },
  seperator: {
    marginTop: 20,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  subLabel: {
    color: colors.grey_4,
    fontSize: 10,
  },
});
