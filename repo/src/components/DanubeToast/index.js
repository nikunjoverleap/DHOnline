import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { SCREEN_NAME_MY_CART } from '../../constants';
import { CART_TOAST } from '../../screens/MyCart/constants';
import DanubeText, { TextVariants } from '../DanubeText';

const DanubeToast = ({ props }) => {
  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const toastData = myCartData?.[CART_TOAST]?.componentData;

  if (props?.success) {
    return (
      <View style={styles.success}>
        <View style={{ marginRight: 9 }}>
          <SvgUri uri={toastData?.successIcon} />
        </View>
        <DanubeText variant={TextVariants.XXXS}>{props.message}</DanubeText>
      </View>
    );
  } else {
    return (
      <View style={styles.fail}>
        <View style={{ marginRight: 9 }}>
          <SvgUri uri={toastData?.failureIcon} />
        </View>
        <DanubeText variant={TextVariants.XXXS}>{props.message}</DanubeText>
      </View>
    );
  }
};

export default DanubeToast;

const styles = StyleSheet.create({
  fail: {
    backgroundColor: '#FFF2F2',
    width: '95%',
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 9,
    borderWidth: 1,
    borderColor: '#F19E9A',
    borderRadius: 4,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#E1FFF8',
    width: '95%',
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 9,
    borderWidth: 1,
    borderColor: '#94E1D0',
    borderRadius: 4,
    alignItems: 'center',
  },
});
