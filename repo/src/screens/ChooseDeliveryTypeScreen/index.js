import AsyncStorage from '@react-native-async-storage/async-storage';
import isEmpty from 'lodash.isempty';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import BackArrow from '../../../assets/svg/cart-back-arrow.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import { SCREEN_NAME_MY_CART } from '../../constants';
import colors from '../../styles/colors';
import CheckoutHeader from '../MyCart/components/CheckoutHeader';
import { DELIVERY_CONTAINER } from '../MyCart/constants';
import { DeliveryContainer } from '../MyCart/DeliveryContainer';

const ChooseDeliveryTypeScreen = ({ navigation, route }) => {
  const { deliveryTypes = [] } = route?.params || {};

  const { userProfile, userToken } = useSelector((state) => state.auth);

  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const deliveryTypeInfo = myCartData?.[DELIVERY_CONTAINER]?.componentData;

  const [selectedDeliveryType, setSelectedDeliveryType] = useState(
    deliveryTypes?.[0]
  );

  return (
    <SafeAreaView style={styles.main}>
      <CheckoutHeader
        mainIcon={<DanubeLogo />}
        navigation={navigation}
        backIcon={<BackArrow />}
      />
      <DeliveryContainer
        labelsAndIcons={deliveryTypeInfo}
        typeDataArr={deliveryTypes}
        onSelectDeliveryType={async (typeData) => {
          setSelectedDeliveryType(typeData);
          if (typeData?.carrier_code === 'tablerate') {
            if (isEmpty(userToken)) {
              const receivedAddress = await AsyncStorage.getItem(
                'GUEST_SHIPPING_ADDRESS'
              );
              if (receivedAddress) {
                navigation.navigate('Checkout', { deliveryTypes });
              } else {
                navigation.navigate('AddressInput');
              }
            } else {
              if (userProfile?.customer?.addresses?.length > 0) {
                navigation.navigate('Checkout');
              } else {
                navigation.navigate('AddressInput');
              }
            }
          } else {
            navigation.navigate('ClickAndCollect');
          }
        }}
        selectedDeliveryType={selectedDeliveryType}
      />
    </SafeAreaView>
  );
};

export default ChooseDeliveryTypeScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
