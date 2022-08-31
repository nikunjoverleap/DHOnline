import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Tooltip from 'react-native-walkthrough-tooltip';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import colors from '../../../styles/colors';
import AdditionalDetails from './AdditionalDetails';

const ChargeItem = ({
  label,
  amount,
  icon,
  additionalData,
  couponCode = '',
  hideInCart = false,
  isFromCart = false,
  price,
  conditions,
  isCashonDelivery = false,
  item,
}) => {
  const amountLabel = price === 0 ? 'Free' : amount;
  const hideIfValueZero =
    price === 0 && conditions?.hideIfZeroAmount ? true : false;
  const [showToolTip, setShowToolTip] = useState(false);
  if (
    (hideInCart && isFromCart) ||
    (additionalData && couponCode === null) ||
    hideIfValueZero ||
    (isCashonDelivery === false && item?.id === 'cod_charge')
  ) {
    return null;
  } else {
    return (
      <View style={styles.subContainer}>
        <View style={styles.subtotal}>
          <View style={styles.left}>
            {additionalData ? (
              <DanubeText color={colors.black} variant={TextVariants.XS}>
                {label.replace('${couponCode}', couponCode || '')}
              </DanubeText>
            ) : (
              <DanubeText color={colors.black} variant={TextVariants.XS}>
                {label || ''}
              </DanubeText>
            )}

            {additionalData ? (
              <Tooltip
                isVisible={showToolTip}
                showChildInTooltip={false}
                childContentSpacing={0}
                onClose={() => setShowToolTip(false)}
                content={
                  <AdditionalDetails
                    additionalData={additionalData}
                    onClose={() => setShowToolTip(false)}
                  />
                }
                placement="top"
              >
                {icon ? (
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setShowToolTip(true)}
                  >
                    <SvgUri uri={icon} />
                  </TouchableOpacity>
                ) : null}
              </Tooltip>
            ) : null}
          </View>

          <DanubeText
            style={styles.price}
            color={colors.black}
            variant={TextVariants.XS}
          >
            {amountLabel || ''}
          </DanubeText>
        </View>
      </View>
    );
  }
};

export default ChargeItem;

const styles = StyleSheet.create({
  subContainer: {
    marginTop: 13,
  },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  icon: {
    marginLeft: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
