import Joi from '@hapi/joi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import BackArrow from '../../../assets/svg/BackArrow.svg';
import DhLocationMarker from '../../../assets/svg/DhLocationMarker.svg';
import KeyBoardAwareView from '../../components/KeyBoardAwareView';
import {
  CLICK_AND_COLLECT_RECEIVER_INFO,
  SCREEN_NAME_CLICK_AND_COLLECT,
  SCREEN_NAME_LOGIN_AND_REGISTRATION,
} from '../../constants';
import colors from '../../styles/colors';
import { getStoreInformation } from './actions';
import StyleSheetFactory from './ClickAndCollectStyle';
import { CLICK_AND_COLLECT_DATA } from './constants';

const MapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export default ClickAndCollectScreen = ({ navigation }) => {
  const { language, country } = useSelector((state) => state.auth);
  const { storeInformation } = useSelector((state) => state.clickAndCollect);

  const [selectedStore, setSelectedStore] = useState({});
  const [isStoreSelected, setIsStoreSelected] = useState(false);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState(null);
  const [inputValidationErorrMsg, setInputValidationErorrMsg] = useState({
    id: null,
    msg: null,
  });
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const { screenSettings } = useSelector((state) => state.screens);
  const { loginScreen } = screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION];
  const { clickAndCollectScreen } =
    screenSettings[SCREEN_NAME_CLICK_AND_COLLECT];
  const componentData =
    screenSettings[SCREEN_NAME_CLICK_AND_COLLECT]?.components[
      CLICK_AND_COLLECT_DATA
    ]?.componentData;

  const [isLoading, setIsLoading] = useState(false);

  let styles = StyleSheetFactory.getSheet(language, isStoreSelected);
  const dispatch = useDispatch();

  const contactInfoSchema = Joi.object({
    firstName: Joi.string().required().messages({
      'string.base': loginScreen?.componentData?.firstNameErrorBase,
      'string.empty': loginScreen?.componentData?.firstNameErrorEmpty,
      'any.required': loginScreen?.componentData?.firstNameErrorRequired,
    }),
    lastName: Joi.string().required().messages({
      'string.base': loginScreen?.componentData?.lastNameErrorBase,
      'string.empty': loginScreen?.componentData?.lastNameErrorEmpty,
      'any.required': loginScreen?.componentData?.lastNameErrorRequired,
    }),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .messages({
        'string.base': loginScreen?.componentData?.emailErrorBase,
        'string.empty': loginScreen?.componentData?.emailErrorEmpty,
        'any.required': loginScreen?.componentData?.emailErrorRequired,
        'string.email': loginScreen?.componentData?.emailValidationErrorMsg,
      }),
    mobile: Joi.string()
      .required()
      .pattern(
        new RegExp(loginScreen?.config?.mobileValidation?.[country]?.regex)
      )
      .messages({
        'string.base': loginScreen?.componentData?.mobileErrorBase,
        'string.empty': loginScreen?.componentData?.mobileErrorEmpty,
        'any.required': loginScreen?.componentData?.mobileErrorRequired,
        'string.pattern.base':
          loginScreen?.componentData?.mobileValidationErrorMsg[country],
      }),
  });

  useEffect(() => {
    getStoreInformation('p1DDl5ZKp9h07Qg5AF1omuWW7b3AA1VS', dispatch);

    //get receiver info
    getUserInfoFromLocalStorage();

    //header
    navigation.setOptions({
      headerLeft: HeaderLeft,
      headerTitleStyle: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 20,
        fontWeight: '',
        color: '#333333',
      },
      headerStyle: {
        shadowOpacity: 100,
        shadowOffset: {
          height: 2,
        },
        shadowRadius: 2,
      },
    });
  }, []);

  const getUserInfoFromLocalStorage = async () => {
    const receiverInfoFromLocalStorage = await AsyncStorage.getItem(
      CLICK_AND_COLLECT_RECEIVER_INFO
    );

    const receiverInfoFromLocalStorageObj = JSON.parse(
      receiverInfoFromLocalStorage
    );

    setEmail(receiverInfoFromLocalStorageObj?.email);
    setMobile(receiverInfoFromLocalStorageObj?.mobile);
    setFirstName(receiverInfoFromLocalStorageObj?.firstName);
    setLastName(receiverInfoFromLocalStorageObj?.lastName);
  };

  const clearErrorMsg = (id) => {
    if (inputValidationErorrMsg.id === id) {
      setInputValidationErorrMsg({ id: null, msg: null });
    }
  };

  const HeaderLeft = () => {
    return (
      <View
        style={{
          marginLeft: 12,
          marginRight: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <View
            style={{
              padding: 10,
              transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
            }}
          >
            <BackArrow height={15} width={15} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNameErrorMsg = (id) => {
    return inputValidationErorrMsg?.id === id ? (
      <View>
        <Text style={[styles.nameErrorrMsg]}>
          {inputValidationErorrMsg?.msg}
        </Text>
      </View>
    ) : null;
  };

  const renderErrorMsg = (id) => {
    return inputValidationErorrMsg?.id === id ? (
      <View>
        <Text style={[styles.errorrMsg]}>{inputValidationErorrMsg?.msg}</Text>
      </View>
    ) : null;
  };

  const continueHandler = async () => {
    setIsLoading(true);
    try {
      const value = await contactInfoSchema.validateAsync({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
      });

      if (value) {
        setIsLoading(false);
        value.store = selectedStore;
        AsyncStorage.setItem(
          CLICK_AND_COLLECT_RECEIVER_INFO,
          JSON.stringify(value)
        );
        navigation.navigate('Checkout', {
          type: 'clickAndCollect',
          email,
          mobile,
          selectedStore,
          firstName,
          lastName,
        });
      }
    } catch (err) {
      setIsLoading(false);
      setInputValidationErorrMsg({
        id: err?.details[0]?.path[0],
        msg: err?.details[0]?.message,
      });
    }
  };

  return (
    <KeyBoardAwareView>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            pointerEvents="none"
            // onRegionChangeComplete={onRegionChangeComplete}
            showsMyLocationButton={false}
            showsUserLocation={true}
            showsCompass={false}
            zoomEnabled={true}
            minZoomLevel={13}
            initialRegion={{
              latitude: 25.204849,
              longitude: 55.270782,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={{
              latitude: selectedStore?.latitude || 25.204849,
              longitude: selectedStore?.longitude || 55.270782,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={MapStyle}
          >
            {selectedStore?.latitude && selectedStore?.longitude ? (
              <MapView.Marker
                coordinate={{
                  latitude: selectedStore?.latitude,
                  longitude: selectedStore?.longitude,
                }}
                title={'title'}
                description={'description'}
              >
                <DhLocationMarker height={50} width={37} />
              </MapView.Marker>
            ) : null}
          </MapView>
        </View>
        <View style={styles.storeList}>
          {!isStoreSelected ? (
            <>
              {storeInformation?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedStore(item)}
                    key={index}
                    activeOpacity={0.7}
                  >
                    <View style={styles.storeItem}>
                      <View
                        style={
                          selectedStore?.entity_id === item?.entity_id
                            ? styles.radioSelected
                            : styles.radio
                        }
                      ></View>
                      <View>
                        <Text>{item?.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <ScrollView bounces={false}>
              <ElevatedView
                style={styles.selectedStoreAddressContainer}
                elevation={1}
              >
                <View>
                  <Text style={styles.storeName}>{selectedStore?.name}</Text>
                  <Text style={styles.storeTimeLabel}>
                    {componentData?.collectMsg}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsStoreSelected(false)}>
                  <View style={styles.changeBtn}>
                    <Text style={styles.changeBtnLabel}>
                      {componentData?.changeBtnLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ElevatedView>
              <ElevatedView style={styles.contactInfoContainer} elevation={1}>
                <View>
                  <Text style={styles.contactInfoTitle}>
                    {componentData?.contactInformation}
                  </Text>
                </View>
                <View>
                  <Text style={styles.contactInfoDesc}>
                    {componentData?.contactInfoInstruction}
                  </Text>
                </View>
                <View style={[styles.nameRow, styles.inputContainer]}>
                  <View>
                    <TextInput
                      placeholderTextColor={colors.grey_8}
                      autoFocus
                      style={[
                        styles.nameInput,
                        inputValidationErorrMsg?.id === 'firstName'
                          ? styles.errorrInput
                          : null,
                      ]}
                      onChangeText={(value) => {
                        setFirstName(value);
                        clearErrorMsg('firstName');
                      }}
                      value={firstName}
                      placeholder={componentData?.firstNamePlaceholderTitle}
                      keyboardType="default"
                    />
                    {renderNameErrorMsg('firstName')}
                  </View>
                  <View>
                    <TextInput
                      placeholderTextColor={colors.grey_8}
                      style={[
                        styles.nameInput,
                        inputValidationErorrMsg?.id === 'lastName'
                          ? styles.errorrInput
                          : null,
                      ]}
                      onChangeText={(value) => {
                        setLastName(value);
                        clearErrorMsg('lastName');
                      }}
                      value={lastName}
                      placeholder={componentData?.lastNamePlaceholderTitle}
                      keyboardType="default"
                    />
                    {renderNameErrorMsg('lastName')}
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholderTextColor={colors.grey_8}
                    style={[
                      styles.input,
                      inputValidationErorrMsg?.id === 'email'
                        ? styles.errorrInput
                        : null,
                    ]}
                    onChangeText={(value) => {
                      setEmail(value);
                      clearErrorMsg('email');
                    }}
                    value={email}
                    placeholder={componentData?.emailPlaceholderTitle}
                    keyboardType="email-address"
                  />
                  {renderErrorMsg('email')}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholderTextColor={colors.grey_8}
                    style={[
                      styles.input,
                      inputValidationErorrMsg?.id === 'mobile'
                        ? styles.errorrInput
                        : null,
                    ]}
                    onChangeText={(value) => {
                      setMobile(value);
                      clearErrorMsg('mobile');
                    }}
                    value={mobile}
                    placeholder={componentData?.mobilePlaceholderTitle}
                    keyboardType="number-pad"
                  />
                  {renderErrorMsg('mobile')}
                </View>
              </ElevatedView>
            </ScrollView>
          )}
        </View>
        <ElevatedView style={styles.bottomFooter} elevation={0}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (isStoreSelected) {
                continueHandler();
              } else {
                setIsStoreSelected(true);
              }
            }}
          >
            <View style={styles.btn}>
              {isLoading ? (
                <View style={{ marginRight: 5 }}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : null}

              <View>
                <Text style={styles.btnLabel}>
                  {isStoreSelected
                    ? componentData?.continueBtnLabel
                    : componentData?.selectStoreLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ElevatedView>
      </View>
    </KeyBoardAwareView>
  );
};
