import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { InputField } from '../../components/InputField';
import Text from '../../components/Text';
import PhoneVerificationIcon from '../../../assets/svg/PhoneVerificationIcon.svg';
import { GENERATE_MOBILE_LOGIN_OTP } from '../../helper/gql';
import { useMutation } from '@apollo/client';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { mobileNumberReg } from '../../helper/Global';
import { Loader } from '../../components/Loder';
import { colors } from '../../constants/theme';

export const SigninWithOtp = ({
  OnCancelPress,
  onSendVerificationCode = () => {},
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [generateLoginOTP] = useMutation(GENERATE_MOBILE_LOGIN_OTP);
  const [isLoading, setIsLoading] = useState(false);

  const [isMobileNumberErrVisible, setIsMobileNumberErrVisible] =
    useState(false);
  const [isNumberNotValidErrVisible, setIsNumberNotValidErrVisible] =
    useState(false);
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState('');

  const onNextPress = async () => {
    if (!mobileNumber) {
      setIsMobileNumberErrVisible(true);
    } else if (!mobileNumberReg.test(mobileNumber)) {
      setIsNumberNotValidErrVisible(true);
    } else {
      setIsLoading(true);
      const { data, loading, error } = await generateLoginOTP({
        variables: {
          phonenumber: mobileNumber,
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res?.data?.generateLoginOTP?.status === 'true') {
            onSendVerificationCode(mobileNumber);
          } else {
            setIsErrorMessageVisible(res?.data?.generateLoginOTP?.message);
          }
        })
        .catch((error) => {
          logError(error);
          setIsLoading(false);
        });
    }
  };
  const removeAllErrorMessage = () => {
    setIsNumberNotValidErrVisible(false);
    setIsErrorMessageVisible('');
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

      {/* {======================= USE YOUR ACCOUNT TO GET STARTED =======================} */}
      <Text style={styles.useYourAccountTextStyle}>
        USE YOUR ACCOUNT TO GET STARTED
      </Text>
      <Block flex={false} center margin={[10, 0, 10, 0]}>
        <PhoneVerificationIcon height={70} width={70} />
      </Block>
      <Text style={styles.enterYourMobileNumber}>Enter Your Mobile Number</Text>

      {/* {======================= Mobile Number InputFeild =======================} */}
      <Block padding={[0, 10, 0, 10]} flex={false} row>
        <Block flex={false} width={'18%'} center>
          <InputField
            containerStyle={styles.countryCodeTextStyle}
            placeholder="+971"
            isDisabled={true}
          />
        </Block>
        <Block>
          <InputField
            containerStyle={styles.fullWidth}
            onChangeText={(text) => {
              removeAllErrorMessage();
              setMobileNumber(text);
            }}
            value={mobileNumber}
            placeholder="Mobile Number*"
            keyboardType={'number-pad'}
            maxLength={9}
          />
        </Block>
      </Block>

      {/* =================== Mobile Number error message =================== */}
      {isMobileNumberErrVisible ||
      isNumberNotValidErrVisible ||
      isErrorMessageVisible ? (
        <Block flex={false} row width={'100%'}>
          <ErrorTextMesage
            containerStyle={{ width: '22%' }}
            errorMessage={''}
          />

          {/* =================== Lastname error message =================== */}
          <ErrorTextMesage
            containerStyle={{ flex: 1, paddingRight: 15 }}
            errorMessage={
              isErrorMessageVisible
                ? isErrorMessageVisible
                : isNumberNotValidErrVisible
                ? "Please enter a valid 9 Digit UAE mobile number. Don't use a prefix like +971 or 00971 or 0"
                : 'This field is required!'
            }
          />
        </Block>
      ) : null}

      {/* {================ You'll receive a 5 digit code on this number =================} */}
      <Text style={styles.youWillReceiveTextStyle}>
        You'll receive a 5 digit code on this number.
      </Text>

      {/* {=============== NEXT BUTTON =====================} */}
      <Block flex={false} margin={[0, 0, 15, 0]}>
        <ActionButton
          onPress={() => onNextPress()}
          buttonStyle={styles.nextButtonContainerStyle}
          buttonColor={'#DD1B28'}
          labelStyle={[
            styles.nextButtonLabelStyle,
            {
              color: isLoading ? '#DD1B28' : '#FFFFFF',
            },
          ]}
          label={'NEXT'}
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
  youWillReceiveTextStyle: {
    fontSize: 10,
    alignSelf: 'center',
    marginVertical: 10,
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
