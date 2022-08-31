import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import BackArrow from '../../../../assets/svg/cart-back-arrow.svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import SingleSidedShadowBox from '../../../components/SingleSidedShadowBox';
import { rotateIcon } from '../../../helper/Global';
import colors from '../../../styles/colors';

const CartHeader = ({
  navigation,
  label,
  noOfItems,
  isEmptyCartHeader = false,
  headerTitle,
  headerHeight,
  description,
  fromCart = false,
}) => {
  return (
    <SingleSidedShadowBox>
      <View style={styles.container}>
        <View
          style={{ backgroundColor: fromCart ? colors.white : colors.white_2 }}
        >
          <View
            style={[styles.main, { height: headerHeight ? headerHeight : 69 }]}
          >
            {!isEmptyCartHeader ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.button, rotateIcon]}
              >
                <BackArrow width={18} height={18} color={colors.black} />
              </TouchableOpacity>
            ) : null}

            {headerTitle && (
              <DanubeText
                variant={TextVariants.M}
                mediumText
                style={{ marginBottom: 8 }}
              >
                {headerTitle}
              </DanubeText>
            )}

            {label && (
              <DanubeText
                variant={fromCart ? TextVariants.M : TextVariants.XS}
                mediumText={fromCart ? true : false}
                regular
                color={colors.black}
              >
                {isEmptyCartHeader
                  ? label
                  : label.replace('{num_of_items}', noOfItems)}
              </DanubeText>
            )}

            {description && (
              <DanubeText
                variant={TextVariants.XXS}
                regular
                color={colors.black}
                style={{ marginTop: 5 }}
              >
                {description}
              </DanubeText>
            )}
          </View>
        </View>
      </View>
    </SingleSidedShadowBox>
  );
};

export default CartHeader;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    left: 8,
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { height: 2 },
    shadowOpacity: 0.2,
    elevation: 6,
  },
});
