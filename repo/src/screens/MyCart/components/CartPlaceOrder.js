import React from 'react';
import { StyleSheet, View } from 'react-native';
import DanubeText, { TextVariants } from '../../../components/DanubeText';

import colors from '../../../styles/colors';

const CartPlaceOrder = ({
  header,
  youSaved,
  currencyCode,
  subLabel,
  subTotal,
  subTotalWithDiscount,
}) => {
  return (
    <View>
      <DanubeText mediumText style={styles.total}>
        {header}
      </DanubeText>
      <View style={styles.container}>
        <View style={styles.price}>
          <DanubeText color={colors.red_2} variant={TextVariants.Base}>
            {currencyCode}{' '}
          </DanubeText>
          <DanubeText color={colors.red_2} bold>
            {subTotalWithDiscount}
          </DanubeText>
          {youSaved > 0 ? (
            <DanubeText light variant={TextVariants.S} style={styles.striked}>
              {currencyCode}
              {subTotal}
            </DanubeText>
          ) : null}
        </View>
        {youSaved > 0 ? (
          <View style={styles.saved}>
            <DanubeText variant={TextVariants.XS} style={styles.savedText}>
              {subLabel}
            </DanubeText>
            <DanubeText
              variant={TextVariants.XS}
              mediumText
              style={styles.savedText}
            >
              {''} {currencyCode} {youSaved}
            </DanubeText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CartPlaceOrder;

const styles = StyleSheet.create({
  striked: {
    textDecorationLine: 'line-through',
    color: colors.grey_4,
    marginLeft: 5,
  },
  saved: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedText: {
    fontSize: 12,
    color: colors.black_2,
  },
  button: {
    marginHorizontal: 17,
    marginBottom: 13,
  },
  total: {
    marginLeft: 20,
    marginBottom: 4,
    marginTop: 9.39,
  },
  container: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 17,
    justifyContent: 'space-between',
    marginBottom: 11,
    alignItems: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
