import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { ActionButton } from '../../components/ActionButton';
import Block from '../../components/Block';
import { ErrorTextMesage } from '../../components/ErrorTextMessage';
import { InputField } from '../../components/InputField';
import { Loader } from '../../components/Loder';
import Text from '../../components/Text';
import { SCREEN_NAME_PLP } from '../../constants';
import { colors } from '../../constants/theme';
import {
  emailValidationReg,
  logError,
  logInfo,
  mobileNumberReg,
  passwordReg,
  showToast,
} from '../../helper/Global';
import {
  CREATE_CUSTOMER,
  GENERATE_REG_OTP,
  VERIFY_REG_OTP,
} from '../../helper/gql';

export const SignUp = ({ onModalClose, onExistingUserPress }) => {
  const [isResendOTPButtonVisible, setIsResendOTPButtonVisible] =
    useState(false);
  const { language, country } = useSelector((state) => state.auth);

  const [isOtpVerifySuccess, setIsOtpVerifySuccess] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: '',
    otp: '',
  });

  const [isFirstNameErrVisible, setIsFirstNameErrVisible] = useState(false);
  const [isLastNameErrVisible, setIsLastNameErrVisible] = useState(false);
  const [isPhoneNumberErrVisible, setIsPhoneNumberErrVisible] = useState(false);
  const [isEmailErrVisible, setIsEmailErrVisible] = useState(false);
  const [isPasswordErrVisible, setIsPasswordErrVisible] = useState(false);
  const [isNumberNotValidErrVisible, setIsNumberNotValidErrVisible] =
    useState(false);
  const [isOTPSentMessageVisible, setIsOTPSentMessageVisible] = useState(false);
  const [isInValidErrVisible, setIsInValidErrVisible] = useState(false);

  const [isInvalidEmailErrVisible, setIsInvalidEmailErrVisible] =
    useState(false);
  const [isInvalidPasswordErrVisible, setiIsInvalidPasswordErrVisible] =
    useState(false);
  const [isVerifyNumberErrVisible, setIsVerifyNumberErrVisible] =
    useState(false);
  const [isSendOtpFailErrVisible, setIsSendOtpFailErrVisible] = useState('');
  const [isNumberErrVisible, setIsNumberErrVisible] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPLoading, setisOTPLoading] = useState(false);

  const [generateRegOTP] = useMutation(GENERATE_REG_OTP);
  const [verifyRegOTP] = useMutation(VERIFY_REG_OTP);
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  useEffect(() => {
    setTimeout(() => {
      setIsOTPSentMessageVisible(false);
    }, 5000);
  }, [isOTPSentMessageVisible]);

  const onPressSendOtp = async () => {
    if (!userDetails?.mobileNumber) {
      setIsNumberErrVisible(true);
    } else if (isNumberNotValidErrVisible) {
      logInfo('data =generateRegOTP=====> Enter valid mobileNumber ');
    } else {
      setisOTPLoading(true);

      const { data, loading, error } = await generateRegOTP({
        variables: {
          phonenumber: userDetails?.mobileNumber,
        },
      })
        .then((res) => {
          setisOTPLoading(false);
          if (res?.data?.generateRegOTP?.status === 'true') {
            setIsResendOTPButtonVisible(true);
            setIsOTPSentMessageVisible(true);
            removeAllErrorMessage();
          } else {
            setIsSendOtpFailErrVisible(res?.data?.generateRegOTP?.message);
          }
        })
        .catch((error) => {
          logError(error);
          setisOTPLoading(false);
          logError(error);
        });
    }
  };

  const onPressResendOtp = () => {
    onPressSendOtp();
  };

  const onPressVerifyOtp = async () => {
    if (!userDetails?.mobileNumber || !userDetails?.otp) {
    } else {
      setisOTPLoading(true);
      const { data, loading, error } = await verifyRegOTP({
        variables: {
          phonenumber: userDetails?.mobileNumber,
          otp: userDetails?.otp,
        },
      })
        .then((res) => {
          setisOTPLoading(false);
          if (res?.data?.verifyRegOTP?.status === 'true') {
            setIsOtpVerifySuccess(true);
          } else {
            setIsInValidErrVisible(true);
          }
        })
        .catch((error) => {
          logError(error);
          setisOTPLoading(false);
        });
    }
  };

  const removeAllErrorMessage = async () => {
    setIsFirstNameErrVisible(false);
    setIsLastNameErrVisible(false);
    setIsPhoneNumberErrVisible(false);
    setIsEmailErrVisible(false);
    setIsPasswordErrVisible(false);
    setIsInValidErrVisible(false);
    setIsInvalidEmailErrVisible(false);
    setiIsInvalidPasswordErrVisible(false);
    setIsVerifyNumberErrVisible(false);
    setIsSendOtpFailErrVisible('');
  };

  const onCreateNewAccountPress = async () => {
    removeAllErrorMessage();
    if (
      !userDetails?.firstName ||
      !userDetails?.lastName ||
      !userDetails?.mobileNumber ||
      !userDetails?.email ||
      !userDetails?.password
    ) {
      !userDetails?.firstName && setIsFirstNameErrVisible(true);
      !userDetails?.lastName && setIsLastNameErrVisible(true);
      !userDetails?.mobileNumber && setIsPhoneNumberErrVisible(true);
      !userDetails?.email && setIsEmailErrVisible(true);
      !userDetails?.password && setIsPasswordErrVisible(true);
    } else if (!userDetails?.firstName) {
      setIsFirstNameErrVisible(true);
    } else if (!userDetails?.lastName) {
      setIsLastNameErrVisible(true);
    } else if (!userDetails?.mobileNumber) {
      setIsPhoneNumberErrVisible(true);
    } else if (!userDetails?.email) {
      setIsEmailErrVisible(true);
    } else if (!emailValidationReg.test(userDetails?.email?.trim())) {
      setIsInvalidEmailErrVisible(true);
    } else if (!userDetails?.password) {
      setIsPasswordErrVisible(true);
    } else if (!passwordReg.test(userDetails?.password?.trim())) {
      setiIsInvalidPasswordErrVisible(true);
    } else if (!isOtpVerifySuccess) {
      setIsVerifyNumberErrVisible(true);
    } else {
      setIsLoading(true);

      const { data, loading, error } = await createCustomer({
        variables: {
          input: {
            email: userDetails?.email,
            firstname: userDetails?.firstName,
            lastname: userDetails?.lastName,
            password: userDetails?.password,
            telephone: userDetails?.mobileNumber,
            mobilenumber: userDetails?.mobileNumber,
          },
        },
      })
        .then((res) => {
          setIsLoading(false);
        })
        .catch((error) => {
          logError(error);
        });
    }
  };

  return (
    <Block flex={false} padding={[10, 10, 10, 10]}>
      <Block flex={false} center>
        <Text size={14} style={styles.signupText}>
          SIGN UP HERE
        </Text>
      </Block>
      <Block flex={false} center>
        <Text size={14} style={styles.signupText}>
          PLEASE ENTER YOUR DETAILS
        </Text>
      </Block>

      {/* { =================== First & Last Name =================== } */}
      <Block flex={false} row>
        <InputField
          containerStyle={styles.firstName}
          placeholder="First Name"
          onChangeText={(text) => {
            setUserDetails({
              ...userDetails,
              firstName: text,
            });
            removeAllErrorMessage();
          }}
          value={userDetails?.firstName}
        />

        <InputField
          containerStyle={styles.lastName}
          placeholder="Last Name"
          onChangeText={(text) => {
            setUserDetails({
              ...userDetails,
              lastName: text,
            });
            removeAllErrorMessage();
          }}
          value={userDetails?.lastName}
        />
      </Block>

      {isFirstNameErrVisible || isLastNameErrVisible ? (
        <Block flex={false} row width={'100%'}>
          {/* =================== Firstname error message =================== */}
          <ErrorTextMesage
            containerStyle={{ width: '50%' }}
            errorMessage={isFirstNameErrVisible && 'This field is required!'}
          />

          {/* =================== Lastname error message =================== */}
          <ErrorTextMesage
            containerStyle={{ width: '50%', marginLeft: 5 }}
            errorMessage={isLastNameErrVisible && 'This field is required!'}
          />
        </Block>
      ) : null}

      {/* { =================== Number & SendOTP button =================== } */}
      <Block flex={false} row margin={[10, 0, 0, 0]}>
        <Block style={styles.countrycodeView} flex={false} row width={'50%'}>
          <Block
            flex={false}
            width={'20%'}
            color={'rgba(225,225,225,1)'}
            center
            middle
          >
            <Text size={10} width={'100%'} center>
              +971
            </Text>
          </Block>
          <InputField
            containerStyle={styles.phoneNumberTextInput}
            placeholder="5xxxxxxxx"
            onChangeText={(text) => {
              setIsNumberNotValidErrVisible(true);
              if (mobileNumberReg.test(text)) {
                setIsNumberNotValidErrVisible(false);
              }
              setUserDetails({
                ...userDetails,
                mobileNumber: text,
              });
              removeAllErrorMessage();
            }}
            value={userDetails?.mobileNumber}
            keyboardType={'number-pad'}
            maxLength={9}
          />
        </Block>

        {isResendOTPButtonVisible && (
          <InputField
            containerStyle={{
              paddingHorizontal: 5,
              paddingVertical: 5,
              borderRadius: 1,
              marginTop: 0,
              marginBottom: 0,
              borderWidth: 1,
              borderColor: 'rgba(225,225,225,1)',
              left: 5,
              width: '20%',
            }}
            placeholder=""
            onChangeText={(text) => {
              setUserDetails({
                ...userDetails,
                otp: text,
              });
              removeAllErrorMessage();
            }}
            value={userDetails?.otp}
            keyboardType={'number-pad'}
          />
        )}

        <Block style={styles.sendOTPButtonView}>
          <Block flex={false}>
            {isResendOTPButtonVisible ? (
              <ActionButton
                onPress={() => onPressVerifyOtp()}
                buttonColor={'#FFFFFF'}
                labelStyle={[
                  styles.sendOTPText,
                  {
                    color: isOTPLoading ? '#000000' : '#FFFFFF',
                  },
                ]}
                buttonStyle={styles.sendOTPButtonStyle}
                label={'Verify OTP'}
              />
            ) : (
              <ActionButton
                onPress={() => onPressSendOtp()}
                buttonColor={'#FFFFFF'}
                labelStyle={[
                  styles.sendOTPText,
                  {
                    color: isOTPLoading ? '#000000' : '#FFFFFF',
                  },
                ]}
                buttonStyle={styles.sendOTPButtonStyle}
                label={'Send OTP'}
              />
            )}
            {isOTPLoading ? (
              <Block
                style={{ position: 'absolute', height: '100%', width: '50%' }}
              >
                <Loader size={'small'} color={colors?.white} />
              </Block>
            ) : null}
          </Block>
        </Block>
      </Block>

      {isOTPSentMessageVisible && (
        <Block flex={false} width={'100%'}>
          <ErrorTextMesage
            containerStyle={{ width: '50%', marginTop: 5 }}
            errorMessage={'Otp sent successfully'}
            color={'green'}
          />
        </Block>
      )}

      {isNumberErrVisible ||
      isSendOtpFailErrVisible ||
      isPhoneNumberErrVisible ||
      isNumberNotValidErrVisible ||
      (isResendOTPButtonVisible && isInValidErrVisible) ? (
        <Block flex={false} row width={'100%'} margin={[5, 0, 0, 0]}>
          {/* =================== Phone number error message =================== */}
          <ErrorTextMesage
            containerStyle={{ width: '50%' }}
            errorMessage={
              isSendOtpFailErrVisible
                ? isSendOtpFailErrVisible
                : isNumberErrVisible || isNumberNotValidErrVisible
                ? 'Please enter a valid number.'
                : isPhoneNumberErrVisible && 'This field is required!'
            }
          />

          {/* =================== Invalid OTP Error message =================== */}
          <ErrorTextMesage
            containerStyle={{ width: '50%', marginLeft: 10 }}
            errorMessage={
              isResendOTPButtonVisible && isInValidErrVisible && 'Invalid OTP!'
            }
          />
        </Block>
      ) : null}

      {isResendOTPButtonVisible && (
        <Block flex={false} row>
          <Block flex={false} row width={'50%'} />
          <TouchableOpacity onPress={() => onPressResendOtp()}>
            <Text
              size={10}
              width={'100%'}
              center
              style={[
                styles.termsConditionStyle,
                { marginLeft: 10, marginTop: 5 },
              ]}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        </Block>
      )}

      {/* { =================== Email =================== } */}
      <InputField
        containerStyle={styles.emailContainerView}
        placeholder="Email"
        onChangeText={(text) => {
          setUserDetails({
            ...userDetails,
            email: text,
          });
          removeAllErrorMessage();
        }}
        value={userDetails?.email}
        keyboardType={'email-address'}
        autoCapitalize={'none'}
      />

      {/* =================== Email error message =================== */}
      {isEmailErrVisible || isInvalidEmailErrVisible ? (
        <Block flex={false} width={'100%'}>
          <ErrorTextMesage
            errorMessage={
              isInvalidEmailErrVisible
                ? 'Email is invalid. Please use a correct E-mail format.'
                : 'This field is required!'
            }
          />
        </Block>
      ) : null}

      {/* { =================== Password =================== } */}
      <InputField
        containerStyle={styles.emailContainerView}
        isSecureText={true}
        placeholder="Password"
        onChangeText={(text) => {
          setUserDetails({
            ...userDetails,
            password: text,
          });
          removeAllErrorMessage();
        }}
        value={userDetails?.password}
      />

      {/* =================== Password error message =================== */}
      {isPasswordErrVisible || isInvalidPasswordErrVisible ? (
        <Block flex={false} width={'100%'}>
          <ErrorTextMesage
            errorMessage={
              isInvalidPasswordErrVisible
                ? 'Password should be at least 8 characters long, include at least one upper case letter, number and one symnbol.'
                : 'This field is required!'
            }
          />
        </Block>
      ) : null}

      {isVerifyNumberErrVisible ? (
        <Block flex={false} margin={[5, 0, 0, 0]} width={'100%'} middle center>
          <ErrorTextMesage
            containerStyle={{ textAlign: 'center' }}
            errorMessage={'Please enter the OTP sent to your mobile number.'}
          />
        </Block>
      ) : null}

      {/* { =================== CREATE AN ACCOUNT =================== } */}
      <Block flex={false}>
        <ActionButton
          onPress={() => onCreateNewAccountPress()}
          buttonStyle={styles.createAnAccountButtonStyle}
          buttonColor={'#DD1B28'}
          labelStyle={[
            styles.createAnAccountText,
            {
              color: isLoading ? '#DD1B28' : '#FFFFFF',
            },
          ]}
          label={'CREATE AN ACCOUNT'}
        />
        {isLoading ? (
          <Block
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          >
            <Loader size={'small'} color={colors?.white} />
          </Block>
        ) : null}
      </Block>

      <Block flex={false} center middle row margin={[10, 0, 10, 0]}>
        <Text size={10}>By registering your agree to our </Text>
        <TouchableOpacity
          onPress={() => {
            onModalClose();
            setTimeout(() => {
              navigation.navigate(SCREEN_NAME_PLP, {
                url: `https://danubehome.com/${country}/${
                  language === 'ae_en' ? 'an' : 'ar'
                }/terms-and-conditions`,
              });
            }, 500);
          }}
        >
          <Text size={10} style={styles.termsConditionStyle}>
            Terms & Condition
          </Text>
        </TouchableOpacity>
      </Block>

      {/* {=================== Existing User ====================} */}
      <ActionButton
        onPress={onExistingUserPress}
        buttonColor={'#FFFFFF'}
        labelStyle={styles.existingLabelText}
        buttonStyle={styles.existingUserButtonStyle}
        label={'Existing User? Log In'}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  signupText: {
    fontWeight: '600',
    marginBottom: 10,
  },
  firstName: {
    width: '50%',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(225,225,225,1)',
    marginRight: 2,
    borderRadius: 1,
  },
  lastName: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(225,225,225,1)',
    marginLeft: 2,
    borderRadius: 1,
  },
  countrycodeView: {
    borderWidth: 1,
    borderColor: 'rgba(225,225,225,1)',
  },
  phoneNumberTextInput: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 1,
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  sendOTPButtonView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sendOTPText: {
    fontSize: 12,
  },
  sendOTPButtonStyle: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    backgroundColor: '#000000',
    marginVertical: 0,
    alignSelf: 'flex-start',
  },
  emailContainerView: {
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(225,225,225,1)',
    marginRight: 2,
    borderRadius: 1,
    marginTop: 10,
  },
  createAnAccountButtonStyle: {
    width: '100%',
    marginTop: 15,
  },
  createAnAccountText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  termsConditionStyle: {
    textDecorationLine: 'underline',
  },
  existingLabelText: {
    color: '#DD1B28',
    fontSize: 14,
  },
  existingUserButtonStyle: {
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,1)',
    borderRadius: 1,
    width: '100%',
  },
});
