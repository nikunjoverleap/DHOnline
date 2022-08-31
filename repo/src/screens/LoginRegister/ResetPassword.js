import { useMutation } from '@apollo/client';
import Joi from '@hapi/joi';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { SCREEN_NAME_LOGIN_AND_REGISTRATION } from '../../constants';
import { logError } from '../../helper/Global';
import { FORGOT_PASSWORD } from '../../helper/gql';
import colors from '../../styles/colors';
import StyleSheetFactory from './LoginRegisterStyle';
const ResetPassword = (props) => {
  const { language } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const { loginScreen } = screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION];
  const { componentData } = loginScreen;
  let styles = StyleSheetFactory.getSheet(language);
  const { closeResetPassword } = props;

  const [email, setEmail] = useState('');
  const [inputValidationErorrMsg, setInputValidationErorrMsg] = useState({
    id: null,
    msg: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetPasswordSchema = Joi.object({
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

  const resetPasswordHandler = async () => {
    setIsLoading(true);
    try {
      const value = await resetPasswordSchema.validateAsync({
        email: email,
      });
      if (value) {
        const { data, loading, error } = await forgotPassword({
          variables: {
            email: email,
          },
        })
          .then((data) => {
            setIsLoading(false);

            if (
              data?.data?.forgotPassword?.status === 'password_reset_link_sent'
            ) {
              Alert.alert(
                componentData?.danubeHomeLabel,
                componentData?.resetPasswordEmailSentMsg,
                [
                  {
                    text: componentData?.okLabel,
                    onPress: () => {
                      closeResetPassword();
                    },
                  },
                ]
              );
            }
          })
          .catch((e) => {
            logError(e);
            //handle error here
            setIsLoading(false);
          });
      }
    } catch (err) {
      logError(err);
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
        <Text style={styles.resetPasswordLink}>
          {componentData?.resetPasswordTitleLabel}
        </Text>
      </View>
      <View>
        <TextInput
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
        onPress={() => resetPasswordHandler()}
      >
        <View style={[styles.BlackBtn, { marginTop: 25 }]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.BlackBtnLabel}>
              {componentData?.resetPasswordSubmitBtnLabel}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => closeResetPassword()}
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

export default ResetPassword;
