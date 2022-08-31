import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { InputField } from '../../components/InputField';
import { Loader } from '../../components/Loder';
import { PressableText } from '../../components/PressableText';
import Text from '../../components/Text';
import { colors } from '../../constants/theme';
import { emailValidationReg, passwordReg } from '../../helper/Global';
import { EMAIL_AND_PASSWORD_LOGIN } from '../../helper/gql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserToken } from '../../slicers/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart, viewCartCustomer } from './actions';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';

export const SigninWithEmail = ({
  onPressSignInWithOtp,
  onPressSignInWithEmail,
  onForgotPasswordPress,
  onModalClose = () => {},
}) => {
  const [userDetails, setUserDetails] = useState({
    email: __DEV__ ? 'muhammed.shafeel@danubehome.com' : '',
    password: __DEV__ ? 'Shafeel@123' : '',
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordErrVisible, setIsPasswordErrVisible] = useState(false);
  const [isEmailErrVisible, setIsEmailErrVisible] = useState(false);
  const [isInvalidEmailErrVisible, setIsInvalidEmailErrVisible] =
    useState(false);
  const [isInvalidPasswordErrVisible, setisInvalidPasswordErrVisible] =
    useState(false);

  const [isLoginErrVisible, setIsLoginErrVisible] = useState('');
  const { pwaGuestToken } = useSelector((state) => state.auth);

  const [generateCustomerToken] = useMutation(EMAIL_AND_PASSWORD_LOGIN);

  const removeAllErrorMessage = async () => {
    setisInvalidPasswordErrVisible(false);
    setIsEmailErrVisible(false);
    setIsInvalidEmailErrVisible(false);
    setIsPasswordErrVisible(false);
    setIsLoginErrVisible('');
  };

  const onLoginPress = async () => {
    if (!userDetails?.email || !userDetails?.password) {
      if (!userDetails?.email) {
        setIsEmailErrVisible(true);
      }
      if (!userDetails?.password) {
        setIsPasswordErrVisible(true);
      }
    } else if (!emailValidationReg.test(userDetails?.email?.trim())) {
      setIsInvalidEmailErrVisible(true);
    } else if (!passwordReg.test(userDetails?.password?.trim())) {
      setisInvalidPasswordErrVisible(true);
    } else {
      setIsLoading(true);

      const { data, loading, error } = await generateCustomerToken({
        variables: {
          email: userDetails?.email,
          password: userDetails?.password,
        },
      })
        .then(async ({ data }) => {
          setIsLoading(false);

          await AsyncStorage.setItem(
            'DH_ONLINE_USER_TOKEN',
            data?.generateCustomerToken?.token
          );

          onModalClose();
          dispatch(setUserToken(data?.generateCustomerToken?.token));
          await mergeCart(pwaGuestToken);
          const viewCartForCustomer = await viewCartCustomer();
          dispatch(setUserCartItems(viewCartForCustomer));
        })
        .catch((error) => {
          logError(error);
          setIsLoading(false);
          setIsLoginErrVisible(error?.graphQLErrors[0]?.message);
        });
    }
  };

  return (
    <>
      {/* {================ Signin with OTP and Email Button ===================} */}
      <Block
        flex={false}
        width={'95%'}
        selfcenter
        row
        radius={16}
        style={styles.signInWithOTPAndEmailMainView}
      >
        <TouchableOpacity
          onPress={onPressSignInWithOtp}
          style={styles.signInWithOTPBtn}
        >
          <Text size={11}>SIGN IN WITH OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressSignInWithEmail}
          style={styles.signInWithEmailBtn}
        >
          <Text color={'white'} size={11} style={styles.signInWithEmailTxt}>
            SIGN IN WITH EMAIL
          </Text>
        </TouchableOpacity>
      </Block>

      {/* {=============== Email and Passwors Feild ================} */}

      <Block flex={false} margin={[20, 0, 5, 0]}>
        <InputField
          onChangeText={(text) => {
            removeAllErrorMessage();
            setUserDetails({
              ...userDetails,
              email: text,
            });
          }}
          value={userDetails?.email}
          placeholder="Email Address/Mobile number*"
          keyboardType={'email-address'}
          autoCapitalize={'none'}
        />
      </Block>

      {/* =================== Email error message =================== */}
      {isEmailErrVisible || isInvalidEmailErrVisible ? (
        <Block flex={false} width={'90%'} selfcenter>
          <ErrorTextMesage
            errorMessage={
              isInvalidEmailErrVisible
                ? 'Email is invalid. Please use a correct E-mail format.'
                : 'This field is required!'
            }
          />
        </Block>
      ) : null}

      <Block flex={false} margin={[5, 0, 10, 0]}>
        <InputField
          placeholder="Password"
          isSecureText={true}
          onChangeText={(text) => {
            removeAllErrorMessage();
            setUserDetails({
              ...userDetails,
              password: text,
            });
          }}
          value={userDetails?.password}
        />
      </Block>

      {/* =================== Password error message =================== */}
      {isPasswordErrVisible ||
      isInvalidPasswordErrVisible ||
      isLoginErrVisible ? (
        <Block flex={false} width={'90%'} selfcenter>
          <ErrorTextMesage
            errorMessage={
              isLoginErrVisible
                ? isLoginErrVisible
                : isInvalidPasswordErrVisible
                ? 'Password should be at least 8 characters long, include at least one upper case letter, number and one symnbol.'
                : 'This field is required!'
            }
          />
        </Block>
      ) : null}

      {/* {================= Login Button ======================} */}
      <Block flex={false} margin={[0, 0, 10, 0]}>
        <ActionButton
          onPress={() => onLoginPress()}
          buttonStyle={styles.loginBtnStyle}
          buttonColor={'#DD1B28'}
          labelStyle={[
            styles.loginTxtStyle,
            {
              color: isLoading ? '#DD1B28' : '#FFFFFF',
            },
          ]}
          label={'LOGIN'}
        />
        {isLoading ? (
          <Block
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          >
            <Loader size={'small'} color={colors?.white} />
          </Block>
        ) : null}
      </Block>

      {/* {=================== Forgot your password ====================} */}
      <PressableText
        text={'Forgot your password?'}
        onPress={onForgotPasswordPress}
        textStyle={styles.forgotYourPasswordTxt}
        containerStyle={styles.forgotYourPasswordContainerStyle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  signInWithOTPAndEmailMainView: { overflow: 'hidden' },
  signInWithOTPBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#D3D3D3',
  },
  signInWithEmailBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1A0E0E',
  },
  signInWithEmailTxt: { fontWeight: '500' },
  loginBtnStyle: {
    width: '95%',
  },
  loginTxtStyle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  forgotYourPasswordTxt: { color: '#DD1B28' },
  forgotYourPasswordContainerStyle: { marginBottom: 10 },
});
