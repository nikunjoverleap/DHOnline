import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Joi from '@hapi/joi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyleSheetFactory from './LoginRegisterStyle';
import {
  SCREEN_NAME_LOGIN_AND_REGISTRATION,
  DH_ONLINE_GUEST_EMAIL,
} from '../../constants';
import colors from '../../styles/colors';

const ContinueAsGuestForm = (props) => {
  const { language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const { userProfile = {} } = useSelector((state) => state.auth);
  const { deliveryTypes = [] } = useSelector((state) => state.cart);
  const clickAndCollectExist = deliveryTypes?.some(
    (item) => item?.carrier_code === 'mageworxpickup'
  );

  const { loginScreen } = screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION];
  const { componentData } = loginScreen;
  let styles = StyleSheetFactory.getSheet(language);
  const { closeContinueAsGuest } = props;

  const [email, setEmail] = useState('');
  useEffect(() => {
    AsyncStorage.getItem(DH_ONLINE_GUEST_EMAIL).then((email) => {
      if (email) {
        setEmail(email);
      }
    });
  }, []);
  const [inputValidationErorrMsg, setInputValidationErorrMsg] = useState({
    id: null,
    msg: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const continueAsGuestSchema = Joi.object({
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
  });

  const clearErrorMsg = (id) => {
    if (inputValidationErorrMsg.id === id) {
      setInputValidationErorrMsg({ id: null, msg: null });
    }
  };

  const onNavigation = async (navigation) => {
    const receivedAddress = await AsyncStorage.getItem(
      'GUEST_SHIPPING_ADDRESS'
    );
    if (receivedAddress) {
      navigation.navigate('Checkout');
    } else {
      navigation.navigate('AddressInput');
    }
  };

  const continueAsGuestHandler = async () => {
    const { navigation, toggleSigninModal, disableMoreOption } = props;
    setIsLoading(true);
    try {
      const value = await continueAsGuestSchema.validateAsync({
        email: email,
      });

      if (value) {
        setIsLoading(false);
        AsyncStorage.setItem(DH_ONLINE_GUEST_EMAIL, email);
        toggleSigninModal();
        disableMoreOption();
        closeContinueAsGuest();
        if (userProfile?.customer?.addresses?.length > 0) {
          navigation.navigate('Checkout');
        } else {
          if (clickAndCollectExist) {
            navigation.navigate('ChooseDeliveryType', { deliveryTypes });
          } else {
            onNavigation(navigation);
          }
        }
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
    <View>
      <View>
        <TextInput
          autoFocus
          placeholderTextColor={colors.grey_8}
          style={[
            styles.Input,
            inputValidationErorrMsg?.id === 'email' ? styles.errorrInput : null,
          ]}
          onChangeText={(value) => {
            setEmail(value);
            clearErrorMsg('email');
          }}
          value={email}
          placeholder={componentData?.emailPlaceholderTitle}
          keyboardType="email-address"
        />
      </View>

      {inputValidationErorrMsg?.msg ? (
        <View>
          <Text style={[styles.errorrMsg, { marginBottom: 0 }]}>
            {inputValidationErorrMsg?.msg}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => continueAsGuestHandler()}
      >
        <View style={[styles.BlackBtn, { marginTop: 25 }]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.BlackBtnLabel}>
              {componentData?.proceedToCheckoutBtnLabel}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => closeContinueAsGuest()}
      >
        <View style={styles.WhiteBtn}>
          <Text style={styles.WhiteBtnLabel}>
            {componentData?.signInTabLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ContinueAsGuestForm;
