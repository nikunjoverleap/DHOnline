import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../constants';
import Block from './Block';
import Text from './Text';

function UpdateProductQty({
  extraMainViewStyle,
  counterExtraTextstyle,
  counter,
  onPlusPress,
  onMinusPress,
  canReduceToZero = false,
  outOfStock = false,
}) {
  return (
    <Block
      style={[
        styles.minusPlusButtonView,
        extraMainViewStyle,
        outOfStock && styles.border,
      ]}
      center
      row
    >
      {/* Minus Button */}
      {outOfStock === false ? (
        <>
          <TouchableOpacity
            style={styles.minusButtonView}
            onPress={() => onMinusPress()}
            disabled={counter === 1 && !canReduceToZero ? true : false}
          >
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          {/* Item Count */}
          <Block flex={false} style={styles.qtyTextView} padding={[0, 0]}>
            <Text style={[styles.counterText, counterExtraTextstyle]}>
              {counter}
            </Text>
          </Block>
          {/* Plus Button */}
          <TouchableOpacity
            style={styles.plusButtonView}
            onPress={() => onPlusPress()}
          >
            <Text style={styles.PlusText}>+</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </Block>
  );
}
export default UpdateProductQty;

const styles = StyleSheet.create({
  minusText: {
    fontSize: 22,
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
    flex: 1,
    // marginHorizontal: 10,
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
  border: {
    borderWidth: 0,
  },
});
