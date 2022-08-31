import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationPin from '../../../assets/svg/location_pin.svg';
import MyLocation from '../../../assets/svg/my_location.svg';

import ArrowBack from '../../../assets/svg/arrow-back.svg';
import MainButton from '../MainButton';
import colors from '../../styles/colors';
const HEIGHT = 95;
const ANDROID_PADDING = 12.61;

const MapModal = ({
  visible,
  onClose,
  buttonLabel,
  confirmAddress,
  address = null,
  latitude,
  longitude,
}) => {
  const [newLatitude, setNewLatitude] = useState(latitude);
  const [newLongitude, setNewLongitude] = useState(longitude);

  const refAutoComplete = useRef();
  const mapRef = useRef();

  const insets = useSafeAreaInsets();

  const onRegionChangeComplete = (region) => {
    setNewLatitude(region.latitude);
    setNewLongitude(region.longitude);
  };

  useEffect(() => {
    if (refAutoComplete.current) {
      refAutoComplete.current.setAddressText(address?.formatted_address);
    }
  }, [address]);

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const setCurrentLocation = (lat, long) => {
    setNewLatitude(lat);
    setNewLongitude(long);
    mapRef.current.animateToRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View>
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={() => onClose()}
      >
        <View>
          {latitude && longitude ? (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.mapStyle}
              onRegionChangeComplete={onRegionChangeComplete}
              showsUserLocation={true}
              zoomEnabled={true}
              minZoomLevel={13}
              initialRegion={{
                latitude: newLatitude,
                longitude: newLongitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsBuildings={true}
              showsIndoorLevelPicker={true}
              loadingEnabled={true}
            />
          ) : null}
          <View style={styles.locationPin}>
            <LocationPin />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => goToCurrentLocation()}
            style={[styles.myLocation, { bottom: insets.bottom + HEIGHT }]}
          >
            <MyLocation />
          </TouchableOpacity>
          <View
            style={[
              styles.googlePlace,
              {
                paddingTop:
                  Platform.OS === 'ios' ? insets.top : ANDROID_PADDING,
              },
            ]}
          >
            <GooglePlacesAutocomplete
              enablePoweredByContainer={false}
              renderLeftButton={() => (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => onClose()}
                >
                  <ArrowBack />
                </TouchableOpacity>
              )}
              ref={refAutoComplete}
              returnKeyType={'default'}
              placeholder="Search"
              fetchDetails={true}
              query={{
                key: 'AIzaSyAJpb9bzOPTpz2oCW6buXlLgbe94FqHa2A',
                language: 'en',
              }}
              onPress={(_data, details) => {
                setCurrentLocation(
                  details?.geometry?.location?.lat,
                  details?.geometry?.location?.lng
                );
              }}
              onFail={() => {}}
              styles={styles.googlePlaceAutoCompleteStyle}
            />
          </View>
          {/* </View> */}
        </View>
        <View
          style={[
            styles.mainButton,
            {
              paddingBottom:
                Platform.OS === 'ios' ? insets.top : ANDROID_PADDING,
            },
          ]}
        >
          <MainButton
            label={buttonLabel}
            onPress={() => {
              confirmAddress(newLatitude, newLongitude);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    height: '100%',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  googlePlacesAutocompleteMainView: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  googlePlaceAutoCompleteStyle: {
    textInputContainer: {
      marginLeft: 25,
      marginRight: 17,
    },
  },
  locationPin: {
    bottom: '50%',
    position: 'absolute',
    bordderWidth: 1,
    alignSelf: 'center',
  },
  mainButton: {
    backgroundColor: colors.white,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingTop: 16.45,
    paddingHorizontal: 17,
  },
  backButton: {
    alignItems: 'center',
    paddingRight: 25,
    justifyContent: 'center',
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',

    flexDirection: 'row',
  },
  googlePlace: {
    backgroundColor: colors.transparent_white,
    position: 'absolute',
    width: '100%',
  },
  myLocation: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderColor: colors.white,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    right: 16,
  },
});

export default MapModal;
