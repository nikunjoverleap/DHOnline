import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from 'lodash.isempty';
import React, { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { SCREEN_NAME_MY_CART } from '../../../constants';
import { setUserCartItems } from '../../../slicers/checkout/checkoutSlice';
import colors from '../../../styles/colors';
import { applyCoupon, removeCoupon } from '../actions';
import CollapseContainer from '../collapseContainer';
import { COUPON_CODE_BLOCK } from '../constants';

const CouponCodeBlock = ({
  showModal = () => {},
  couponApplied = '',
  currency = '',
  discountAmount = '',
}) => {
  const [isApplyCouponSuccess, setIsApplyCouponSuccess] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const { screenSettings } = useSelector((state) => state.screens);
  const { pwaGuestToken, userToken } = useSelector((state) => state.auth);
  const screenData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const screenItems = screenData?.[COUPON_CODE_BLOCK]?.componentData?.sections;
  const couponItem = screenItems?.[0];

  const isGuest = isEmpty(userToken) && pwaGuestToken;

  const dispatch = useDispatch();

  const onRemoveCouponPress = async () => {
    let couponData = {};
    if (isGuest) {
      couponData = {
        guestCartId: pwaGuestToken,
      };
    }
    setCouponLoading(true);
    const { data, error } = await removeCoupon(couponData);

    if (error) {
      setCouponLoading(false);
    }
    if (data) {
      dispatch(setUserCartItems(data?.removeCoupon));
      await AsyncStorage.removeItem('COUPONCODE');
      await AsyncStorage.removeItem('IS_COUPONCODE_APPLY');
      setCouponLoading(false);
      setIsApplyCouponSuccess(false);
    }
  };

  const onApplyCouponPress = async (couponCode) => {
    let couponData;
    if (isGuest) {
      couponData = {
        coupon_code: couponCode,
        guestCartId: pwaGuestToken,
      };
    } else {
      couponData = {
        coupon_code: couponCode,
      };
    }
    setCouponLoading(true);
    const { data, error } = await applyCoupon(couponData);
    if (error) {
      setCouponLoading(false);
      Toast.show({
        type: 'general_toast',
        props: {
          message: Object.assign({}, error)?.message || '',
          success: false,
        },
      });
    }
    if (data) {
      dispatch(setUserCartItems(data?.applyCoupon));
      await AsyncStorage.setItem('COUPONCODE', couponCode);
      await AsyncStorage.setItem('IS_COUPONCODE_APPLY', JSON.stringify(true));
      setIsApplyCouponSuccess(true);
      setCouponLoading(false);
      showModal();
    }
  };

  return (
    <View style={{ backgroundColor: colors.grey_10, paddingVertical: 6.5 }}>
      <View style={{ backgroundColor: colors.white }}>
        <CollapseContainer
          currency={currency}
          discountAmount={discountAmount}
          couponApplied={couponApplied}
          couponLoading={couponLoading}
          title={couponItem?.label}
          placeholder={couponItem?.placeholder}
          buttonName={couponItem?.button_label}
          leftIcon={couponItem?.placeHolderIcon}
          successIcon={couponItem?.successPlaceHolderIcon}
          isImageVisible={true}
          onButtonPress={(res) => {
            onApplyCouponPress(res);
          }}
          isApplyCouponSuccess={isApplyCouponSuccess}
          onRemoveButtonPress={() => {
            onRemoveCouponPress();
          }}
        />
      </View>
    </View>
  );
};

export default CouponCodeBlock;
