import React from 'react';
import { StyleSheet, View } from 'react-native';
import DanubeText from '../../../components/DanubeText';
import colors from '../../../styles/colors';

const FreeShippingMessage = ({
  description = '',
  amount = '',
  currencyType = '',
  extraStyle = {},
  freeShipping = false,
}) => {
  const amountWithCurrencyCode = `${currencyType || ''} ${amount || ''}`;
  return (
    <View style={[styles.main, extraStyle]}>
      <DanubeText style={{ fontSize: 13 }}>
        {freeShipping
          ? description
          : description?.replace('${amount}', amountWithCurrencyCode)}
      </DanubeText>
    </View>
  );
};

export default FreeShippingMessage;

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.yellow_1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.yellow_2,
    paddingVertical: 7,
    justifyContent: 'center',
  },
});
