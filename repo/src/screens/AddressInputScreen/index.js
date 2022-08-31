import React, { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackArrow from '../../../assets/svg/cart-back-arrow.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import MapModal from '../../components/MapModal';
import colors from '../../styles/colors';
import { getCustomerProfile } from '../authentication/actions';
import {
  createCustomerNewAddress,
  updateCustomerAddress,
} from '../MyCart/actions';

import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import DanubeText from '../../components/DanubeText';
import MainButton from '../../components/MainButton';
import { SCREEN_NAME_ADDRESS_INPUT } from '../../constants';
import { logError } from '../../helper/Global';
import CheckoutHeader from '../MyCart/components/CheckoutHeader';
import Shipping_ from '../MyCart/Shipping_';
import { MAP_MODAL } from './constant';

const PLATFORM_VERSION = 23;

const AddressInputScreen = ({ navigation, route }) => {
  const {
    isEditAddress = false,
    editAddressID = null,
    item = {},
  } = route?.params || {};

  const [showMap, setShowMap] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [permission, setPermission] = useState(false);

  const { screenSettings } = useSelector((state) => state.screens);
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const addressInputData =
    screenSettings?.[SCREEN_NAME_ADDRESS_INPUT]?.components;
  const modalData = addressInputData?.[MAP_MODAL]?.componentData;
  const { userToken, userProfile = {} } = useSelector((state) => state.auth);
  const { deliveryTypes } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const openSettings = () => {
    Linking.openSettings().catch((error) => {
      logError(error);
      Alert.alert('Unable to open settings');
    });
  };

  const hasPermissionIOS = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      setPermission(false);
    }

    if (status === 'disabled') {
      setPermission(false);
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < PLATFORM_VERSION) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG
      );
    }

    return false;
  };

  const onConfirmAddress = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const addressComponent = json.results[0];
        setAddress(addressComponent);
        setShowMap(false);
      })
      .catch((error) => {
        logError(error);
        // eslint-disable-next-line no-console
        // console.warn(error);
      });
  };

  const setAddressByTyping = (newAddress) => {
    setAddress(newAddress);
  };

  const getLocation = async () => {
    Geocoder.init('AIzaSyAJpb9bzOPTpz2oCW6buXlLgbe94FqHa2A');
    const hasPermission = await hasLocationPermission();
    setPermission(hasPermission);
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentLatitude(position.coords.latitude);
          setCurrentLongitude(position.coords.longitude);
          Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then((json) => {
              const addressComponent = json.results[0];
              setAddress(addressComponent);
            })
            .catch((error) => {
              logError(error);
              // eslint-disable-next-line no-console
              // console.warn(error);
            });

          if (userProfile?.customer?.addresses?.length > 0) {
            setShowMap(false);
          } else {
            setTimeout(() => {
              setShowMap(true);
              // eslint-disable-next-line no-magic-numbers
            }, 500);
          }
        },
        (error) => {
          // eslint-disable-next-line no-console
          logError(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      hasPermissionIOS();
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        getLocation();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      {permission ? (
        <>
          {currentLatitude && currentLatitude ? (
            <>
              <CheckoutHeader
                mainIcon={<DanubeLogo />}
                navigation={navigation}
                backIcon={<BackArrow />}
              />

              {/* Shipping Address */}
              <Shipping_
                currentItem={item}
                editAddressID={editAddressID}
                isEditAddress={isEditAddress}
                latitude={currentLatitude}
                longitude={currentLongitude}
                navigation={navigation}
                address={address}
                onShowMap={() => setShowMap(true)}
                saveAddress={async (
                  checkAddressUpdate,
                  data,
                  addressID,
                  disableLoader
                ) => {
                  if (checkAddressUpdate) {
                    await updateCustomerAddress(addressID, data);
                    await getCustomerProfile({ token: userToken }, dispatch);
                    disableLoader();
                    navigation.navigate('Checkout', { deliveryTypes });
                  } else {
                    await createCustomerNewAddress(data, cartItems);
                    await getCustomerProfile({ token: userToken }, dispatch);
                    disableLoader();
                    navigation.navigate('Checkout', { deliveryTypes });
                  }
                }}
              />
              {(currentLatitude || currentLatitude === 0) &&
              (currentLongitude || currentLongitude === 0) ? (
                <MapModal
                  address={address}
                  confirmAddress={onConfirmAddress}
                  setAddressByTyping={setAddressByTyping}
                  visible={showMap}
                  onClose={() => setShowMap(false)}
                  longitude={currentLongitude}
                  latitude={currentLatitude}
                  buttonLabel={modalData?.buttonLabel}
                />
              ) : null}
            </>
          ) : null}
        </>
      ) : (
        <View style={styles.main}>
          <CheckoutHeader
            mainIcon={<DanubeLogo />}
            navigation={navigation}
            backIcon={<BackArrow />}
          />
          <View style={styles.settings}>
            <DanubeText center>Please enable your location</DanubeText>
            <MainButton
              style={styles.margin}
              label={'Open Settings'}
              onPress={() => openSettings()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddressInputScreen;

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.white,
    flex: 1,
  },

  settings: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  margin: {
    marginTop: 16,
  },
});
