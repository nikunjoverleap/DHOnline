import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import GoogleStaticMap from 'react-native-google-static-map';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import MainButton from '../../components/MainButton';
import ShadowBorder from '../../components/ShadowBorder';
import {
  DH_ONLINE_GUEST_EMAIL,
  FONT_FAMILY_ENGLISH_REGULAR,
  SCREEN_NAME_LOGIN_AND_REGISTRATION,
} from '../../constants';
import colors from '../../styles/colors';
import TextInputContainer from './TextInputContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash.isempty';
import Joi from '@hapi/joi';
import KeyBoardAwareView from '../../components/KeyBoardAwareView';

const Shipping_ = ({
  saveAddress = () => {},
  onShowMap,
  address,
  navigation,
  latitude,
  longitude,
  isEditAddress = false,
  editAddressID = null,
  currentItem = {},
}) => {
  const [processing, setProcessing] = useState(false);

  const { country, userToken, pwaGuestToken } = useSelector(
    (state) => state.auth
  );
  const isGuest = !userToken && pwaGuestToken;
  const [inputValidationErorrMsg, setInputValidationErorrMsg] = useState({
    id: null,
    msg: null,
  });

  const clearErrorMsg = (id) => {
    if (inputValidationErorrMsg.id === id) {
      setInputValidationErorrMsg({ id: null, msg: null });
    }
  };

  const renderErrorMsg = (id) => {
    return inputValidationErorrMsg?.id === id ? (
      <ErrorTextMesage
        containerStyle={styles.errorText}
        errorMessage={inputValidationErorrMsg?.msg || ''}
      />
    ) : null;
  };

  const isInvalid = (id) => inputValidationErorrMsg?.id === id;

  useEffect(() => {
    if (isEditAddress) {
      setFirstName(currentItem?.firstname || '');
      setLastName(currentItem?.lastname || '');
      setPhoneNumber(currentItem?.telephone || '');
      setAppartmentNumber(currentItem?.flat_number || '');
      if (currentItem?.danube_address_type === 1) {
        setAsHome(true);
        setAsWork(false);
      }
      if (currentItem?.danube_address_type === 2) {
        setAsHome(false);
        setAsWork(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isGuest) {
      AsyncStorage.getItem(DH_ONLINE_GUEST_EMAIL).then((email) => {
        if (email) {
          setEmail(email);
        }
      });
    }
  }, []);

  const { screenSettings } = useSelector((state) => state.screens);
  const { loginScreen } = screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION];

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
          loginScreen?.componentData?.mobileValidationErrorMsg?.[country],
      }),
    apartmentNumber: Joi.string().required().messages({
      'string.empty': loginScreen?.componentData?.apartmentNumberErrorEmpty,
      'any.required': loginScreen?.componentData?.apartmentNumberRequired,
    }),
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appartmentNumber, setAppartmentNumber] = useState('');
  const [isHome, setAsHome] = useState(true);
  const [isWork, setAsWork] = useState(false);

  const disableLoader = () => setProcessing(false);

  const clickSaveAddressBtn = async () => {
    setProcessing(true);
    try {
      const value = await contactInfoSchema.validateAsync({
        firstName: firstName,
        lastName: lastName,
        email: userToken ? 'abc@test.com' : email,
        mobile: phoneNumber,
        apartmentNumber: appartmentNumber,
      });
      if (isGuest) {
        AsyncStorage.setItem(DH_ONLINE_GUEST_EMAIL, email);
      }

      if (value) {
        // eslint-disable-next-line no-magic-numbers
        const address_type_int = isHome ? 1 : 2;
        const data = {
          city: address?.address_components?.[4]?.long_name,
          //TODO: recheck this
          //  country_code: address?.address_components?.[0]?.short_name,
          //  country_id: address?.address_components?.[0]?.short_name,
          country_code: 'AE',
          country_id: 'AE',
          firstname: firstName,
          flat_number: appartmentNumber,
          lastname: lastName,
          latitude: latitude,
          longitude: longitude,
          map_fields: address?.formatted_address,
          postcode: '000000',
          street: address?.formatted_address,
          telephone: phoneNumber,
          region: {
            region: address?.address_components?.[1]?.long_name,
          },
          danube_address_type: address_type_int,
        };

        const defaultBillingANdShipping = {
          default_billing: true,
          default_shipping: true,
        };

        const combinedData = {
          ...data,
          ...defaultBillingANdShipping,
        };

        if (isEditAddress) {
          saveAddress(true, data, editAddressID, disableLoader);
        } else {
          if (userToken) {
            saveAddress(false, combinedData, editAddressID, disableLoader);
          } else {
            AsyncStorage.setItem(
              'GUEST_SHIPPING_ADDRESS',
              JSON.stringify(data)
            );
            disableLoader();
            navigation.navigate('Checkout');
          }
        }
      }
    } catch (error) {
      disableLoader();
      setInputValidationErorrMsg({
        id: error?.details[0]?.path?.[0],
        msg: error?.details[0]?.message,
      });
    }
  };

  return (
    <KeyBoardAwareView>
      <View style={styles.container}>
        <View>
          <DanubeText
            color={colors.black_3}
            variant={TextVariants.S}
            mediumText
            style={styles.header}
          >
            New Shipping address
          </DanubeText>
          <View style={styles.shippingAdrressContainer}>
            <View style={styles.mapContainer}>
              <GoogleStaticMap
                latitude={latitude?.toString() || '25'}
                longitude={longitude?.toString() || '55'}
                zoom={13}
                size={{ width: 81, height: 100 }}
                apiKey={'AIzaSyDZV7Mg-3vVLNG1YV4e2zpM6gR6Yqja6qc'}
              />
            </View>
            <View style={styles.locationText}>
              <DanubeText variant={TextVariants.XXS} color={colors.black}>
                {address?.formatted_address}
              </DanubeText>
            </View>
            <View style={styles.changeButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.changeButton}
                onPress={() => onShowMap()}
              >
                <DanubeText
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                  }}
                >
                  Change
                </DanubeText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textInputContainer}>
            <View style={styles.firstName}>
              <TextInputContainer
                title={'First Name'}
                value={firstName}
                placeholder={'First Name'}
                onChangeText={(data) => {
                  setFirstName(data);
                  clearErrorMsg('firstName');
                }}
                keyboardType={'default'}
                isInvalid={isInvalid('firstName')}
              />
              {renderErrorMsg('firstName')}
            </View>
            <View style={styles.lastName}>
              <TextInputContainer
                title={'Last Name'}
                value={lastName}
                placeholder={'Last Name'}
                onChangeText={(data) => {
                  setLastName(data);
                  clearErrorMsg('lastName');
                }}
                keyboardType={'default'}
                isInvalid={isInvalid('lastName')}
              />
              {renderErrorMsg('lastName')}
            </View>
          </View>

          <View style={{ marginHorizontal: 16 }}>
            {isEmpty(userToken) && (
              <>
                <TextInputContainer
                  value={email}
                  placeholder={'Email'}
                  onChangeText={(data) => {
                    setEmail(data);
                    clearErrorMsg('email');
                  }}
                  keyboardType={'email-address'}
                  isInvalid={isInvalid('email')}
                />
                {renderErrorMsg('email')}
              </>
            )}

            <TextInputContainer
              value={phoneNumber}
              placeholder={'Phone Number'}
              onChangeText={(data) => {
                setPhoneNumber(data);
                clearErrorMsg('mobile');
              }}
              keyboardType={'phone-pad'}
              isInvalid={isInvalid('mobile')}
            />
            {renderErrorMsg('mobile')}
            <TextInputContainer
              value={appartmentNumber}
              placeholder={'Apartment/Flat Number, Tower Number, Building Name'}
              onChangeText={(data) => {
                setAppartmentNumber(data);
                clearErrorMsg('apartmentNumber');
              }}
              keyboardType={'default'}
              isInvalid={isInvalid('apartmentNumber')}
            />
            {renderErrorMsg('apartmentNumber')}
          </View>

          <View style={styles.radioContainer}>
            <DanubeText variant={TextVariants.XXS}>
              Address Label (Option)
            </DanubeText>
            <TouchableOpacity
              style={styles.radioLabelContainer}
              onPress={() => {
                setAsHome(true);
                setAsWork(false);
              }}
              activeOpacity={0.8}
            >
              <View
                style={[styles.radioLabel, isHome && styles.backgroundColor]}
              />
              <DanubeText variant={TextVariants.XXXS}>Home</DanubeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioLabelContainer}
              onPress={() => {
                setAsHome(false);
                setAsWork(true);
              }}
              activeOpacity={0.8}
            >
              <View
                style={[styles.radioLabel, isWork && styles.backgroundColor]}
              />
              <DanubeText variant={TextVariants.XXXS}>Work</DanubeText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomButton}>
          <ShadowBorder />
          <MainButton
            processing={processing}
            style={{
              marginTop: 18,
              marginHorizontal: 16,
              marginBottom: Platform.OS === 'ios' ? 0 : 18,
            }}
            onPress={() => clickSaveAddressBtn()}
            label={'SAVE ADDRESS'} // TODO Show label from contentful
          />
        </View>
      </View>
    </KeyBoardAwareView>
  );
};
export default Shipping_;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  shippingAdrressContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 4,
    borderColor: '#E9E9E9',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    marginRight: 15,
    marginLeft: 10,
    marginVertical: 10,
  },
  radioLabel: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1,
    marginRight: 5.6,
  },
  radioLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 19,
  },
  locationText: {
    flex: 2,
    justifyContent: 'center',
  },
  changeButtonContainer: {
    marginHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButton: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#707070',
  },
  textInputContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  selectPaymentInfo: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  firstName: {
    flex: 1,
    marginRight: 7,
  },
  lastName: {
    flex: 1,
    marginLeft: 7,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  markerViewStyle: {
    height: 200,
    width: 200,
  },
  waitMinsMainView: {
    height: 55,
    width: 45,
  },
  googlePlaceAutoCompleteStyle: {
    textInputContainer: {
      width: '100%',
    },
    textInput: {
      top: 2,
      height: 40,
      color: '#5d5d5d',
      fontSize: 16,
      marginHorizontal: 5,
    },
    predefinedPlacesDescription: {
      color: 'red',
    },
    listView: {
      width: 250,
    },
    poweredContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  mapView: {
    height: '100%',
    width: '100%',
  },
  googlePlacesAutocompleteMainView: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  cancelMainView: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'rgb(69,69,69)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingLeft: 30,
    paddingRight: 30,
  },
  cancelTextView: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: 'white',
  },
  saveAddressMainView: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'rgb(246,143, 37)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 15,
  },
  saveAddressTextView: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: 'white',
  },
  addNewAddressMainView: {
    width: '100%',
    height: 30,
    marginTop: 10,
    borderColor: '#9A9A9A',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressFirstTxt: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#454545',
  },
  addressLastNameTxt: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  errorText: {
    marginLeft: 2,
  },
  editMainView: {
    width: 60,
    height: 30,
    marginTop: 10,
    backgroundColor: 'rgb(231,230,224)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  editTxtView: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#454545',
  },
  header: {
    marginTop: 18,
    marginBottom: 19,
    marginHorizontal: 15,
  },
  backgroundColor: {
    backgroundColor: colors.black,
  },
  bottomButton: {},
});
