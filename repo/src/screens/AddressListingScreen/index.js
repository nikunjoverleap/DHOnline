import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BackArrow from '../../../assets/svg/cart-back-arrow.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import { Loader } from '../../components/Loder';
import MainButton from '../../components/MainButton';
import ShadowBorder from '../../components/ShadowBorder';
import colors from '../../styles/colors';
import { getCustomerProfile } from '../authentication/actions';
import { setDefaultAddress } from '../MyCart/actions';
import CheckoutHeader from '../MyCart/components/CheckoutHeader';
import AddressBody from './components/AddressBody';
import AddShippingAddress from './components/AddShippingAddress';

const AddressListingScreen = ({ navigation, route }) => {
  const { userProfile = {}, userToken } = useSelector((state) => state.auth);
  const { itemId } = route.params;

  const [addresses, setAddresses] = useState(userProfile?.customer?.addresses);
  const [defaultAddressSelected, setDefaultAddressSelected] = useState(0);

  const [addressId, setAddressId] = useState(itemId);

  const [loading, setLoading] = useState(false);

  const onAddButtonPress = () => {
    navigation.navigate('AddressInput');
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setAddresses(userProfile?.customer?.addresses);
  }, [userProfile]);

  return (
    <SafeAreaView style={styles.main}>
      <CheckoutHeader
        mainIcon={<DanubeLogo />}
        navigation={navigation}
        backIcon={<BackArrow />}
      />
      <ShadowBorder />
      <ScrollView style={{}} bounces={false}>
        <View>
          {addresses?.map((item, index) => {
            return (
              <View key={item.id}>
                <AddressBody
                  flatNumber={item?.flat_number}
                  length={addresses?.length || 0}
                  item={item}
                  editAddressID={item?.id}
                  index={index}
                  defaultAddressSelected={defaultAddressSelected}
                  navigation={navigation}
                  isDefault={item?.default_shipping}
                  addressType={item?.danube_address_type}
                  name={`${item?.firstname} ${item?.lastname}`}
                  address={item.map_fields}
                  mobileNo={item?.telephone}
                  extraStyle={styles.addressBody}
                  editButton
                  deleteButton
                  onSelect={() => {
                    setDefaultAddressSelected(index);
                    setAddressId(item?.id);
                  }}
                />
              </View>
            );
          })}
          <View style={styles.inputButton}>
            <AddShippingAddress
              extraStyle={styles.shopAddress}
              onAddButtonPress={onAddButtonPress}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ShadowBorder />

        <MainButton
          style={styles.extraButtonContainer}
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            await setDefaultAddress(addressId, {
              default_billing: true,
              default_shipping: true,
            });
            await getCustomerProfile({ token: userToken }, dispatch);
            setDefaultAddressSelected(0);
            setLoading(false);
            navigation.goBack();
          }}
          label={loading ? '' : 'CONFIRM'}
        />
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader size={6} color={colors.white} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default AddressListingScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    backgroundColor: colors.white,
  },
  extraButtonContainer: {
    marginVertical: 18,
    marginHorizontal: 16,
  },
  shopAddress: {
    marginTop: 10,
    marginBottom: 10,
  },
  addressBody: {
    marginHorizontal: 14,
    marginTop: 17,
  },
  inputButton: {
    backgroundColor: colors.grey_10,
    paddingTop: 13,
  },
  loaderContainer: {
    width: '100%',
    height: 24,
    position: 'absolute',
    top: '40%',
  },
});
