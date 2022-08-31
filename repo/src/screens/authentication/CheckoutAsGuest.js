import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { InputField } from '../../components/InputField';
import Text from '../../components/Text';
import { DH_ONLINE_GUEST_EMAIL, GENERIC_ERROR_MESSAGE } from '../../constants';
import {
  emailValidationReg,
  Analytics_Events,
  logError,
  logInfo,
  showToast,
} from '../../helper/Global';
import { CHECKOUT_AS_GUEST } from '../../helper/gql';

export const CheckoutAsGuest = ({
  navigation,
  onPressCancelButton = () => {},
  onModalClose = () => {},
}) => {
  const [email, setEmail] = useState(__DEV__ ? 'test@gmail.com' : '');
  const [isEmailErrVisible, setIsEmailErrVisible] = useState(false);
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);

  const [isInvalidEmailErrVisible, setIsInvalidEmailErrVisible] =
    useState(false);
  const [checkoutAsGuest] = useMutation(CHECKOUT_AS_GUEST);
  const { pwaGuestToken, language } = useSelector((state) => state.auth);
  const removeAllErrorMessage = async () => {
    setIsEmailErrVisible(false);
    setIsInvalidEmailErrVisible(false);
  };

  const onCheckoutPress = async () => {
    try {
      if (!email) {
        setIsEmailErrVisible(true);
      } else if (!emailValidationReg.test(email?.trim())) {
        setIsInvalidEmailErrVisible(true);
      } else {
        const { data } = await checkoutAsGuest({
          variables: {
            emailInput: {
              email: email,
              cart_id: `${pwaGuestToken}`,
            },
          },
        });
        await AsyncStorage.setItem(
          DH_ONLINE_GUEST_EMAIL,
          data?.setGuestEmailOnCart?.cart?.email
        );
        onModalClose();
        navigation.navigate('Checkout');
        onCheckOutLogEvent();
        logInfo('checkoutAsGuest==>>', data);
      }
    } catch (e) {
      showToast({
        type: 'error',
        message: GENERIC_ERROR_MESSAGE(language, e.message),
      });
      logError(e);
    }
  };

  const onCheckOutLogEvent = () => {
    let customData = {};
    let productItemArr = [];

    cartItems?.cartData?.items?.map((el) => {
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.product?.categories?.map((dataObj, index) => {
        if (index === 0) {
          categoriesLevel2 = dataObj?.name;
        } else if (index === 1) {
          categoriesLevel3 = dataObj?.name;
        } else if (index === 2) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      productItemArr.push({
        item_brand: DEFAULT_BRAND, //TODO Indetify brand
        item_category: categoriesLevel2,
        item_category2: categoriesLevel3,
        item_category3: categoriesLevel4,
        item_id: el?.product?.sku,
        item_list_id: '', //rowData?.rowName
        item_list_name: '', //rowData?.rowName
        item_name: el?.product?.name,
        //  item_location_id: `slot${0}_${0}`, //row_index  , productIndex
        price: parseFloat(el?.price),
      });
    });

    customData = {
      coupon: '',
      currency: cartItems?.cartData?.base_currency_code,
      items: productItemArr,
      value: cartItems?.cartData?.grand_total,
    };

    Analytics_Events({
      eventName: 'Check_Out',
      params: customData,
    });
  };

  return (
    <Block flex={false} padding={[10, 10, 10, 10]}>
      {/* { ====================  ENTER YOUR EMAIL ==================== } */}
      <Text
        style={{
          alignSelf: 'center',
          fontWeight: '600',
          marginBottom: 10,
        }}
      >
        ENTER YOUR EMAIL
      </Text>

      {/* { ==================== Email label ==================== } */}
      <Text style={{ textAlign: 'center', marginVertical: 10 }}>
        Submit your email to continue as guest
        <Text style={{ color: 'red' }}> *</Text>
      </Text>

      {/* { ==================== Email Input Feild ==================== } */}
      <InputField
        containerStyle={{ width: '95%', borderWidth: 1, borderRadius: 5 }}
        onChangeText={(text) => {
          setEmail(text);
        }}
        value={email}
        placeholder={'Enter your email'}
      />

      {(isEmailErrVisible || isInvalidEmailErrVisible) && (
        <Block flex={false} width={'95%'} selfcenter>
          <ErrorTextMesage
            errorMessage={
              isInvalidEmailErrVisible
                ? 'Email is invalid. Please use a correct E-mail format.'
                : 'This field is required!'
            }
          />
        </Block>
      )}

      {/* { ==================== CANCEL AND PROCEED TO CHECKOUT BUTTON ==================== } */}
      <Block flex={false} row space={'between'} margin={[5, 0, 0, 0]}>
        <ActionButton
          label={'CANCEL'}
          labelStyle={{
            fontWeight: '500',
            fontSize: 14,
            color: '#000000',
          }}
          buttonStyle={{ backgroundColor: '#D3D3D3' }}
          onPress={onPressCancelButton}
        />
        <ActionButton
          label={'PROCEED TO CHECKOUT'}
          labelStyle={{
            fontWeight: '500',
            fontSize: 14,
            color: '#FFFFFF',
          }}
          buttonStyle={{ backgroundColor: '#3a9c0a', width: '60%', flex: 1 }}
          onPress={() => {
            removeAllErrorMessage();
            onCheckoutPress();
          }}
        />
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  termsConditionStyle: {
    fontWeight: '500',
  },
});
