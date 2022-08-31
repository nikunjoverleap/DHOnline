import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackArrow from '../../../assets/svg/cart-back-arrow.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import ShadowBorder from '../../components/ShadowBorder';
import colors from '../../styles/colors';
import { getCustomerProfile } from '../authentication/actions';
import { createCustomerNewAddress, updateCustomerAddress } from './actions';
import CheckoutHeader from './components/CheckoutHeader';
import Shipping_ from './Shipping_';

const AddressEntryScreen = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <SafeAreaView style={styles.main}>
        <CheckoutHeader
          mainIcon={<DanubeLogo />}
          navigation={navigation}
          backIcon={<BackArrow />}
        />
        <ShadowBorder />

        {/* Shipping Address */}
        <Shipping_
          saveAddress={async (checkAddressUpdaet, data, addressID) => {
            if (checkAddressUpdaet) {
              await updateCustomerAddress(addressID, data);
              await getCustomerProfile({ token: userToken }, dispatch);
            } else {
              await createCustomerNewAddress(data);
            }
          }}
          deliveryTypeResponses={(data) => setDeliveryType(data)}
        />
      </SafeAreaView>
    </View>
  );
};

export default AddressEntryScreen;

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
