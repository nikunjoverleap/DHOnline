import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { InputField } from '../../components/InputField';
import { Loader } from '../../components/Loder';
import Text from '../../components/Text';
import { colors } from '../../constants/theme';
import { emailValidationReg, logError, logInfo } from '../../helper/Global';
import { FORGOT_PASSWORD } from '../../helper/gql';

export const ForgotPassword = ({ onPressRememberLogin }) => {
  const [email, setEmail] = useState('');

  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailErrVisible, setIsEmailErrVisible] = useState(false);
  const [isInvalidEmailErrVisible, setIsInvalidEmailErrVisible] =
    useState(false);

  const removeAllErrorMessage = async () => {
    setIsEmailErrVisible(false);
    setIsInvalidEmailErrVisible(false);
  };

  {
    /* { ==================== onSubmitPress ==================== } */
  }
  const onSubmitPress = async () => {
    if (!email) {
      setIsEmailErrVisible(true);
    } else if (!emailValidationReg.test(email?.trim())) {
      setIsInvalidEmailErrVisible(true);
    } else {
      setIsLoading(true);
      const { data, loading, error } = await forgotPassword({
        variables: {
          email: email,
        },
      })
        .then((data) => {
          setIsLoading(false);
          onPressRememberLogin();
        })
        .catch((error) => {
          setIsLoading(false);
          logError(error);
        });
    }
  };

  return (
    <Block flex={false} padding={[10, 10, 10, 10]}>
      {/* { ==================== get password link ==================== } */}
      <Text
        style={{
          alignSelf: 'center',
          fontWeight: '600',
          marginBottom: 10,
        }}
      >
        Get password link
      </Text>

      {/* { ==================== Email label ==================== } */}
      <Text>
        Email
        <Text style={{ color: 'red' }}>*</Text>
      </Text>

      {/* { ==================== Email Input Feild ==================== } */}
      <InputField
        containerStyle={{ width: '100%' }}
        onChangeText={(text) => {
          removeAllErrorMessage();
          setEmail(text);
        }}
        value={email}
      />

      {/* {======================= VERIFICATION ERROR =======================} */}
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

      {/* { ==================== SUBMIT BUTTON ==================== } */}
      <Block flex={false}>
        <ActionButton
          label={'SUBMIT'}
          labelStyle={{
            fontWeight: '500',
            fontSize: 14,
            color: isLoading ? '#DD1B28' : '#FFFFFF',
          }}
          buttonStyle={{ backgroundColor: '#DD1B28', width: '100%' }}
          onPress={() => {
            removeAllErrorMessage();
            onSubmitPress();
          }}
        />
        {isLoading ? (
          <Block
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          >
            <Loader size={'small'} color={colors?.white} />
          </Block>
        ) : null}
      </Block>

      {/* { ====================  Just remembered? Login ==================== } */}
      <Block flex={false} center row margin={[10, 0, 10, 0]}>
        <Text color={'rgba(150,150,150,1)'} size={10}>
          Just remembered?{' '}
        </Text>
        <TouchableOpacity onPress={onPressRememberLogin}>
          <Text
            color={'rgba(125,125,125,1)'}
            size={10}
            style={styles.termsConditionStyle}
          >
            Log In
          </Text>
        </TouchableOpacity>
        <Text color={'rgba(150,150,150,1)'} size={10}>
          {' '}
          Instead
        </Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  termsConditionStyle: {
    fontWeight: '500',
  },
});
