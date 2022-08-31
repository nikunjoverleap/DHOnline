import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { DH_ONLINE_PWA_GUEST_TOKEN } from '../../../constants';
import { setLogout, setPWAGuestToken } from '../../../slicers/auth/authSlice';
import { setUserCartItems } from '../../../slicers/checkout/checkoutSlice';
import colors from '../../../styles/colors';
import { createEmptyCart } from '../../InvisibleScreen/actions';
import * as Sentry from '@sentry/react-native';

const SignOut = ({ signOutData }) => {
  const dispatch = useDispatch();
  const { sections = [] } = signOutData;
  const { userToken } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(setLogout());
    const viewCartForCustomer = await createEmptyCart();
    await AsyncStorage.setItem(
      DH_ONLINE_PWA_GUEST_TOKEN,
      viewCartForCustomer?.createEmptyCart
    );
    dispatch(setPWAGuestToken(viewCartForCustomer?.createEmptyCart));
    dispatch(setUserCartItems());
    Sentry.setUser(null);
  };

  return (
    <>
      {userToken ? (
        <View style={styles.main}>
          <TouchableOpacity style={styles.row} onPress={() => handleLogout()}>
            <SvgUri uri={sections?.[0]?.icon} />
            <View style={styles.leftText}>
              <DanubeText color={colors.black} variant={TextVariants.XS}>
                {sections?.[0]?.title}
              </DanubeText>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default SignOut;

const styles = StyleSheet.create({
  main: {
    height: 100,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  leftText: {
    paddingLeft: 11.55,
  },
  row: {
    flexDirection: 'row',
  },
});
