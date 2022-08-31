import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { InputField } from '../../components/InputField';
import Text from '../../components/Text';
import PhoneVerificationIcon from '../../../assets/svg/PhoneVerificationIcon.svg';
import {
  GENERATE_MOBILE_LOGIN_OTP,
  VERIFY_MOBILE_LOGIN_OTP,
} from '../../helper/gql';
import { useMutation } from '@apollo/client';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MyCodeField } from '../../components/MyCodeField';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { Loader } from '../../components/Loder';
import { colors } from '../../constants/theme';
import { setUserToken } from '../../slicers/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from './actions';
import { logError } from '../../helper/Global';

export const MobileNumberOTPVerify = ({
  mobileNumber,
  OnCancelPress,
  onModalClose = () => {},
}) => {
  const [smsCode, setSmsCode] = useState('');
  const [verifyLoginOTP] = useMutation(VERIFY_MOBILE_LOGIN_OTP);
  const [generateLoginOTP] = useMutation(GENERATE_MOBILE_LOGIN_OTP);
  const [isVerifyOtpErrVisible, setIsVerifyOtpErrVisible] = useState(false);
  const [isVerifyFailErr, setIsVerifyFailErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSendSuccess, setIsOtpSendSuccess] = useState('');
  const dispatch = useDispatch();
  const { pwaGuestToken } = useSelector((state) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      setIsOtpSendSuccess(false);
    }, 5000);
  }, [isOtpSendSuccess]);

  const onPressVerify = async () => {
    if (!mobileNumber || !smsCode) {
      setIsVerifyOtpErrVisible(true);
    } else {
      setIsLoading(true);
      const { data, loading, error } = await verifyLoginOTP({
        variables: {
          phonenumber: mobileNumber,
          otp: smsCode,
        },
      })
        .then(async (res) => {
          if (res?.data?.verifyLoginOTP?.status === 'true') {
            setIsLoading(false);
            await AsyncStorage.setItem(
              'DH_ONLINE_USER_TOKEN',
              res?.data?.verifyLoginOTP?.token
            );
            onModalClose();
            dispatch(setUserToken(res?.data?.verifyLoginOTP?.token));
            mergeCart(pwaGuestToken);
          } else {
            setIsLoading(false);
            setIsVerifyFailErr(res?.data?.verifyLoginOTP?.message);
          }
        })
        .catch((error) => {
          logError(error);
        });
    }
  };

  const removeAllErrorMessage = async () => {
    setIsVerifyFailErr(false);
    setIsVerifyOtpErrVisible(false);
  };

  const onPressResendOtp = async () => {
    if (!mobileNumber) {
      setIsMobileNumberErrVisible(true);
    } else {
      const { data, loading, error } = await generateLoginOTP({
        variables: {
          phonenumber: mobileNumber,
        },
      })
        .then((res) => {
          if (res?.data?.generateLoginOTP?.status === 'true') {
            setIsOtpSendSuccess(true);
          }
        })
        .catch((error) => {
          logError(error, {
            where: 'data?.generateLoginOTP?.status ===> error ',
          });
        });
    }
  };

  return (
    <>
      {/* {======================= Cancel button =======================} */}
      <ActionButton
        onPress={OnCancelPress}
        buttonColor={'#FFFFFF'}
        labelStyle={styles.fontSize12}
        buttonStyle={styles.cancelButtonStyle}
        label={'Cancel'}
      />

      {/* {======================= PHONE VERIFICATION =======================} */}
      <Text style={styles.useYourAccountTextStyle}>PHONE VERIFICATION</Text>
      <Block flex={false} center margin={[10, 0, 10, 0]}>
        <PhoneVerificationIcon height={70} width={70} />
      </Block>
      <Text style={styles.enterYourMobileNumber}>
        Please Enter 5 digit code send to you
      </Text>

      <Block flex={false} center middle>
        <MyCodeField
          cellCount={5}
          value={smsCode}
          onChangeText={(text) => {
            removeAllErrorMessage();
            setSmsCode(text);
          }}
        />
      </Block>

      {/* {======================= VERIFICATION ERROR =======================} */}
      {(isVerifyFailErr || isVerifyOtpErrVisible) && (
        <Block flex={false} width={'75%'} selfcenter>
          <ErrorTextMesage
            errorMessage={
              isVerifyFailErr ? isVerifyFailErr : 'This field is required!'
            }
          />
        </Block>
      )}

      {/* {======================= OTP SEND SUCCESS MESSAGE =======================} */}
      {isOtpSendSuccess ? (
        <Block flex={false} width={'100%'} selfcenter>
          <ErrorTextMesage
            containerStyle={{ textAlign: 'center' }}
            errorMessage={'Otp sent successfully'}
            color={'green'}
          />
        </Block>
      ) : null}

      {/* {================ Resend OTP =================} */}
      <TouchableOpacity onPress={() => onPressResendOtp()}>
        <Text style={styles.resendOTPTextStyle}>Resend OTP</Text>
      </TouchableOpacity>

      {/* {=============== VERIFY OTP =====================} */}
      <Block flex={false} margin={[0, 0, 15, 0]}>
        <ActionButton
          onPress={() => onPressVerify()}
          buttonStyle={styles.nextButtonContainerStyle}
          buttonColor={'#DD1B28'}
          labelStyle={[
            styles.nextButtonLabelStyle,
            {
              color: isLoading ? '#DD1B28' : '#FFFFFF',
            },
          ]}
          label={'VERIFY OTP'}
        />
        {isLoading ? (
          <Block
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          >
            <Loader size={'small'} color={colors?.white} />
          </Block>
        ) : null}
      </Block>
    </>
  );
};

const styles = StyleSheet.create({
  fontSize12: {
    fontSize: 12,
  },
  cancelButtonStyle: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    alignSelf: 'flex-end',
  },
  useYourAccountTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
  },
  enterYourMobileNumber: {
    fontSize: 12,
    fontWeight: '400',
    alignSelf: 'center',
    marginTop: 10,
  },
  fullWidth: { width: '100%' },
  countryCodeTextStyle: { width: '100%', alignItems: 'center' },
  resendOTPTextStyle: {
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  nextButtonLabelStyle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  nextButtonContainerStyle: {
    width: '95%',
  },
});
