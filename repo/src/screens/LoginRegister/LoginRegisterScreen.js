import React, { useState, useRef, useEffect } from 'react';
import StyleSheetFactory from './LoginRegisterStyle';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import Google from '../../../assets/svg/Google.svg';
import Apple from '../../../assets/svg/Apple.svg';
import Close from '../../../assets/svg/LoginCloseIcon.svg';
import Logo from '../../../assets/svg/Danubehomecom.svg';
import PasswordHide from '../../../assets/svg/Password_Hide.svg';
import PasswordView from '../../../assets/svg/Password_View.svg';
import Tick from '../../../assets/svg/Tick.svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import 'text-encoding-polyfill';
import Joi from '@hapi/joi';
import { mergeCart, viewCartCustomer } from './actions';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';

import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserToken } from '../../slicers/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { EMAIL_AND_PASSWORD_LOGIN } from '../../helper/gql';
import {
  GENERATE_MOBILE_LOGIN_OTP,
  GENERATE_REG_OTP,
  VERIFY_REG_OTP,
  CREATE_CUSTOMER,
  VERIFY_MOBILE_LOGIN_OTP,
} from '../../helper/gql';
import { onSuccessSocialLogin } from './actions';
import LottieView from 'lottie-react-native';
import {
  DH_ONLINE_USER_TOKEN,
  EVENT_NAME_LOGIN,
  EVENT_NAME_SIGNUP,
  SCREEN_NAME_LOGIN_AND_REGISTRATION,
} from '../../constants';
import ResetPassword from './ResetPassword';
import ContinueAsGuestForm from './ContinueAsGuestForm';
import colors from '../../styles/colors';
import { Analytics_Events, logError, logInfo } from '../../helper/Global';

const LoginRegisterScreen = (props) => {
  const { afterSignIn = () => {} } = props;
  const {
    language,
    country = 'ae',
    pwaGuestToken,
  } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const { loginScreen, registrationScreen } =
    screenSettings[SCREEN_NAME_LOGIN_AND_REGISTRATION];

  const [isModalVisible, setIsModalVisible] = useState(props.isVisible);
  const [isShowMoreOption, setIsShowMoreOption] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignInWithMobile, setIsSignInWithMobile] = useState(true);
  const [mobile, setMobile] = useState(null);
  const [otp, setOtp] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isEnableForgotPassword, setIsEnableForgotPassword] = useState(false);
  const [isContinueAsGuest, setIsContinueAsGuest] = useState(false);

  const [signinWithEmailErorrMsg, setSigninWithEmailErorrMsg] = useState(null);
  const [regErorrMsg, setRegErorrMsg] = useState(null);
  const [otpLoader, setOtpLoader] = useState(false);
  const [regLoader, setRegLoader] = useState(false);
  const [signinWithMobileErorrMsg, setSigninWithMobileErorrMsg] =
    useState(null);
  const [signInLoader, setSignInLoader] = useState(false);
  const [isRegSuccess, setIsRegSuccess] = useState(false);
  const [inputValidationErorrMsg, setInputValidationErorrMsg] = useState({
    id: null,
    msg: null,
  });

  const [generateCustomerToken] = useMutation(EMAIL_AND_PASSWORD_LOGIN);
  const [generateLoginOTP] = useMutation(GENERATE_MOBILE_LOGIN_OTP);
  const [generateRegOTP] = useMutation(GENERATE_REG_OTP);
  const [verifyRegOTP] = useMutation(VERIFY_REG_OTP);
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const [verifyLoginOTP] = useMutation(VERIFY_MOBILE_LOGIN_OTP);

  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);

  const dispatch = useDispatch();

  let styles = StyleSheetFactory.getSheet(language, isShowMoreOption);
  const refRBSheet = useRef();

  const signInWithEmailSchema = Joi.object({
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
    password: Joi.string()
      .pattern(new RegExp(loginScreen?.config?.passwordRegex))
      .messages({
        'string.base': loginScreen?.componentData?.passwordErrorBase,
        'string.empty': loginScreen?.componentData?.passwordErrorEmpty,
        'any.required': loginScreen?.componentData?.passwordErrorRequired,
        'string.pattern.base':
          loginScreen?.componentData?.passwordValidationErrorMsg,
      }),
  });

  const signInWithMobileSchema = Joi.object({
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

  const otpSchema = Joi.object({
    otp: Joi.string().min(5).required().messages({
      'string.base': loginScreen?.componentData?.otpErrorBase,
      'string.empty': loginScreen?.componentData?.otpErrorEmpty,
      'any.required': loginScreen?.componentData?.otpErrorRequired,
      'string.min': loginScreen?.componentData?.otpValidationErrorMsg,
    }),
  });

  const regSchema = Joi.object({
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
    otp: Joi.string().min(5).required().messages({
      'string.base': loginScreen?.componentData?.otpErrorBase,
      'string.empty': loginScreen?.componentData?.otpErrorEmpty,
      'any.required': loginScreen?.componentData?.otpErrorRequired,
      'string.min': loginScreen?.componentData?.otpValidationErrorMsg,
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
    password: Joi.string()
      .pattern(new RegExp(loginScreen?.config?.passwordRegex))
      .messages({
        'string.base': loginScreen?.componentData?.passwordErrorBase,
        'string.empty': loginScreen?.componentData?.passwordErrorEmpty,
        'any.required': loginScreen?.componentData?.passwordErrorRequired,
        'string.pattern.base':
          loginScreen?.componentData?.emailValidationErrorMsg,
      }),
  });

  const showMessagesOnSuccess = ({ newToken }) => {
    setShowFullScreenLoader(false);
    Toast.show({
      type: 'general_toast',
      props: {
        message:
          loginScreen?.componentData?.loginSuccessMessage ||
          "You've Successfully Signed In", // TODO Translation contentful
        success: true,
      },
    });
    afterSignIn({ token: newToken });
  };
  const showMessagesOnFailure = () => {
    setShowFullScreenLoader(false);
    Toast.show({
      type: 'general_toast',
      props: {
        message:
          loginScreen?.componentData?.loginFailedMessage ||
          'Something went wrong, please try again', //
        success: false,
      },
    });
  };

  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      //TODO  SHOW LOADER
      try {
        setShowFullScreenLoader(true);
        const { token: newToken } = await onSuccessSocialLogin(
          appleAuthRequestResponse?.identityToken,
          dispatch
        );
        showMessagesOnSuccess({ newToken });
        setIsModalVisible(false);
        toggleSigninModal();
        Analytics_Events({
          eventName: EVENT_NAME_LOGIN,
          params: { method: 'apple' },
        });
      } catch (e) {
        // TO DO Fire error
        logError(e);
        showMessagesOnFailure();
      }
    }
  };

  const onPressSigninWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      //TODO  SHOW LOADER
      setShowFullScreenLoader(true);
      const { token: newToken } = await onSuccessSocialLogin(
        userInfo?.idToken,
        dispatch
      );
      showMessagesOnSuccess({ newToken });
      setIsModalVisible(false);
      toggleSigninModal();
      Analytics_Events({
        eventName: EVENT_NAME_LOGIN,
        params: { method: 'google' },
      });
    } catch (error) {
      logError(error);
      showMessagesOnFailure();
      logInfo('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        logInfo('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        logInfo('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        logInfo('Play Services Not Available or Outdated');
      } else {
        logInfo('Some Other Error Happened');
      }
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (props.isFromProceedToCheckout) {
      setIsShowMoreOption(true);
    }
  }, [props.isFromProceedToCheckout]);

  const signInWithEmailHandler = async () => {
    setRegLoader(true);

    try {
      const value = await signInWithEmailSchema.validateAsync({
        email: email,
        password: password,
      });
      if (value) {
        const { data, loading, error } = await generateCustomerToken({
          variables: {
            email: email,
            password: password,
          },
        })
          .then(async ({ data }) => {
            try {
              setRegLoader(false);
              setShowFullScreenLoader(true);
              await AsyncStorage.setItem(
                DH_ONLINE_USER_TOKEN,
                data?.generateCustomerToken?.token
              );
              dispatch(setUserToken(data?.generateCustomerToken?.token));
              if (pwaGuestToken) {
                await mergeCart(pwaGuestToken);
              }
              const viewCartForCustomer = await viewCartCustomer();
              dispatch(setUserCartItems(viewCartForCustomer));

              if (data?.generateCustomerToken?.token) {
                setIsModalVisible(false);
                toggleSigninModal();
              }
              showMessagesOnSuccess();
              afterSignIn({ token: data?.generateCustomerToken?.token });
              Analytics_Events({
                eventName: EVENT_NAME_LOGIN,
                params: { method: 'email' },
              });
            } catch (e) {
              setShowFullScreenLoader(false);
              setRegLoader(false);
              showMessagesOnFailure();
            }
          })
          .catch((error) => {
            logError(error);
            setRegLoader(false);
            setSigninWithEmailErorrMsg(error?.graphQLErrors[0]?.message);
          });
      }
    } catch (err) {
      setRegLoader(false);
      setInputValidationErorrMsg({
        id: err?.details[0]?.path[0],
        msg: err?.details[0]?.message,
      });
    }
  };

  const onPressSendOtp = async () => {
    setOtpLoader(true);
    if (!mobile) {
      setInputValidationErorrMsg({
        id: 'mobile',
        msg: loginScreen?.componentData?.mobileErrorBase,
      });
      setOtpLoader(false);
      return;
    }

    const { data, loading, error } = await generateRegOTP({
      variables: {
        phonenumber: mobile,
      },
    })
      .then((res) => {
        if (res?.data?.generateRegOTP?.status === 'true') {
          setIsOtpSent(true);
          setOtpLoader(false);
        } else {
          setInputValidationErorrMsg({
            id: 'mobile',
            msg: res?.data?.generateRegOTP?.message,
          });
          setOtpLoader(false);
        }
      })
      .catch((error) => {
        logError(error);
        setOtpLoader(false);
        setInputValidationErorrMsg({
          id: 'mobile',
          msg: loginScreen?.componentData?.mobileErrorBase,
        });
      });
  };

  const onPressVerifyOtp = async () => {
    setOtpLoader(true);
    if (!otp) {
      setInputValidationErorrMsg({
        id: 'otp',
        msg: 'Please enter a valid otp',
      });
      setOtpLoader(false);
      return;
    }

    const { data, loading, error } = await verifyRegOTP({
      variables: {
        phonenumber: mobile,
        otp: otp,
      },
    })
      .then((res) => {
        setOtpLoader(false);
        if (res?.data?.verifyRegOTP?.status === 'true') {
          setIsOtpVerified(true);
        } else {
          setInputValidationErorrMsg({
            id: 'otp',
            msg: loginScreen?.componentData?.otpErrorBase,
          });
        }
      })
      .catch((error) => {
        logError(error);
        setOtpLoader(false);
        setInputValidationErorrMsg({
          id: 'otp',
          msg: loginScreen?.componentData?.otpErrorBase,
        });
      });
  };

  const onCreateNewAccountPress = async () => {
    setRegLoader(true);

    try {
      const value = await regSchema.validateAsync({
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        otp: otp,
        email: email,
        password: password,
      });
      if (value) {
        try {
          const { data, loading, error } = await createCustomer({
            variables: {
              input: {
                email: email,
                firstname: firstName,
                lastname: lastName,
                password: password,
                telephone: mobile,
                mobilenumber: mobile,
              },
            },
          });
          setRegLoader(false);
          setIsRegSuccess(true);
          Analytics_Events({
            eventName: EVENT_NAME_SIGNUP,
            params: { method: 'email' },
          });
        } catch (e) {
          logError(e);
          setRegErorrMsg(loginScreen?.componentData?.regstrationFailedMsg);
        }
      }
    } catch (err) {
      setRegLoader(false);
      setInputValidationErorrMsg({
        id: err?.details?.[0]?.path[0],
        msg: err?.details?.[0]?.message,
      });
    }
  };

  const signInWithMobileHandler = async (mobile) => {
    setOtpLoader(true);
    try {
      const value = await signInWithMobileSchema.validateAsync({
        mobile: mobile,
      });
      if (value) {
        const { data, loading, error } = await generateLoginOTP({
          variables: {
            phonenumber: mobile,
          },
        })
          .then((res) => {
            setOtpLoader(false);
            if (res?.data?.generateLoginOTP?.status === 'true') {
              setIsOtpSent(true);
            } else {
              setInputValidationErorrMsg({
                id: 'mobile',
                msg: res?.data?.generateLoginOTP?.message,
              });
            }
          })
          .catch((error) => {
            logError(error);
            setOtpLoader(false);
          });
      }
    } catch (err) {
      logError(error);
      setOtpLoader(false);
      setInputValidationErorrMsg({
        id: err?.details[0]?.path[0],
        msg: err?.details[0]?.message,
      });
    }
  };

  const signInWithMobileVerify = async () => {
    setSignInLoader(true);
    try {
      const value = await otpSchema.validateAsync({
        otp: otp,
      });
      setSignInLoader(false);
      if (value) {
        const { data, loading, error } = await verifyLoginOTP({
          variables: {
            phonenumber: mobile,
            otp: otp,
          },
        })
          .then(async (res) => {
            setSignInLoader(false);
            setShowFullScreenLoader(true);
            if (res?.data?.verifyLoginOTP?.status === 'true') {
              await AsyncStorage.setItem(
                'DH_ONLINE_USER_TOKEN',
                res?.data?.verifyLoginOTP?.token
              );
              dispatch(setUserToken(res?.data?.verifyLoginOTP?.token));
              await mergeCart(pwaGuestToken);
              const viewCartForCustomer = await viewCartCustomer();
              dispatch(setUserCartItems(viewCartForCustomer));
              setIsModalVisible(false);
              toggleSigninModal();
              showMessagesOnSuccess();
              afterSignIn({ token: res?.data?.verifyLoginOTP?.token });
              Analytics_Events({
                eventName: EVENT_NAME_LOGIN,
                params: { method: 'phonenumber' },
              });
            } else {
              setIsLoading(false);
              setSigninWithMobileErorrMsg(res?.data?.verifyLoginOTP?.message);
            }
            setShowFullScreenLoader(false);
          })
          .catch((error) => {
            logError(error);
            setSigninWithMobileErorrMsg(
              loginScreen?.componentData?.signInFailedMsg
            );
            setSignInLoader(false);
            setShowFullScreenLoader(false);
          });
      }
    } catch (err) {
      logError(err);
      setSignInLoader(false);
      setInputValidationErorrMsg({
        id: err?.details[0]?.path[0],
        msg: err?.details[0]?.message,
      });
    }
  };

  const resendLoginOTP = async () => {
    if (!mobile) {
      setInputValidationErorrMsg({
        id: 'otp',
        msg: loginScreen?.componentData?.mobileErrorBase,
      });
    } else {
      const { data, loading, error } = await generateLoginOTP({
        variables: {
          phonenumber: mobile,
        },
      })
        .then((res) => {
          if (res?.data?.generateLoginOTP?.status === 'true') {
            setIsOtpSendSuccess(true);
          }
        })
        .catch((error) => {
          logError(error);
          logInfo('data?.generateLoginOTP?.status ===> error ', error);
        });
    }
  };

  const continueAsGuestBtn = () => {
    const { isFromProceedToCheckout } = props;
    if (isContinueAsGuest || !isFromProceedToCheckout) {
      return;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          setIsContinueAsGuest(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.WhiteBtn}>
          <Text style={styles.WhiteBtnLabel}>
            {loginScreen?.componentData?.checkoutAsGuestBtnLabel}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTermsAndConditions = () => {
    const { componentData } = loginScreen;

    return (
      <View>
        <Text style={styles.TermsAndConditionLabel}>
          {componentData?.byClickingThisButtonYouAgreeToOurLabel}{' '}
          <Text style={{ textDecorationLine: 'underline', color: '#000000' }}>
            {componentData?.termsOfUserLabel}
          </Text>{' '}
          {componentData?.andLabel}{' '}
          <Text style={{ textDecorationLine: 'underline', color: '#000000' }}>
            {componentData?.privacyPolicyLabel}
          </Text>
        </Text>
      </View>
    );
  };

  const renderRegistrationForm = () => {
    const { componentData } = registrationScreen;
    const { config } = loginScreen;

    return !isRegSuccess ? (
      <>
        <View style={[styles.NameRow]}>
          <View>
            <TextInput
              placeholderTextColor={colors.grey_8}
              autoFocus
              style={[
                styles.NameInput,
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
                styles.NameInput,
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
        {!isOtpSent ? (
          <>
            <View style={styles.MobileInputContainer}>
              <View style={styles.CountryCode}>
                <Text style={styles.CountryCodeLabel}>
                  {config?.countryCode[country]}
                </Text>
              </View>
              <View style={styles.MobileInputRow}>
                <TextInput
                  placeholderTextColor={colors.grey_8}
                  style={[
                    styles.MobileInput,
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
                  maxLength={9}
                />
                <TouchableWithoutFeedback
                  onPress={() => onPressSendOtp()}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.SendOtpBtn,
                      mobile?.length === 9 ? styles.SendOtpBtnEnabled : null,
                    ]}
                  >
                    <View>
                      {otpLoader ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text
                          style={[
                            styles.SendOtpBtnLabel,
                            mobile?.length === 9
                              ? styles.SendOtpBtnLabelEnabled
                              : null,
                          ]}
                        >
                          {componentData?.sendOTPLabel}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {renderErrorMsg('mobile')}
          </>
        ) : (
          <>
            <View style={styles.MobileInputRow}>
              <TextInput
                placeholderTextColor={colors.grey_8}
                style={[
                  styles.RegOtpInput,
                  inputValidationErorrMsg?.id === 'otp'
                    ? styles.errorrInput
                    : null,
                ]}
                onChangeText={(value) => {
                  setOtp(value);
                  clearErrorMsg('otp');
                }}
                value={otp}
                placeholder={componentData?.OTPPlaceholderTitle}
                keyboardType="number-pad"
                maxLength={5}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  onPressVerifyOtp();
                }}
              >
                <View
                  style={[
                    styles.VerifyOtpBtn,
                    isOtpVerified ? styles.OtpVerified : null,
                  ]}
                >
                  {otpLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <View style={{ marginRight: 6 }}>
                        <Tick
                          height={15}
                          width={15}
                          color={isOtpVerified ? '#05BE1E' : '#fff'}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.VerifyOtpBtnLabel,
                            isOtpVerified
                              ? styles.VerifyOtpBtnLabelEnabled
                              : null,
                          ]}
                        >
                          {isOtpVerified
                            ? componentData?.verifiedLabel
                            : componentData?.verifyOTPLabel}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
            {renderErrorMsg('otp')}
          </>
        )}

        <View>
          <TextInput
            placeholderTextColor={colors.grey_8}
            style={[
              styles.Input,
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
        </View>
        {renderErrorMsg('email')}
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholderTextColor={colors.grey_8}
            style={[
              styles.Input,
              inputValidationErorrMsg?.id === 'password'
                ? styles.errorrInput
                : null,
            ]}
            onChangeText={(value) => {
              setPassword(value);
              clearErrorMsg('password');
            }}
            value={password}
            placeholder={componentData?.passwordPlaceholderTitle}
            keyboardType="default"
            secureTextEntry={!showPassword}
          />
          <View style={styles.PasswordIconContainer}>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <PasswordHide height={15} width={20} />
              ) : (
                <PasswordView height={15} width={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {regErorrMsg
          ? renderFinalErrorMsg(regErorrMsg)
          : renderErrorMsg('password')}
        <TouchableOpacity
          onPress={() => {
            onCreateNewAccountPress();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.BlackBtn}>
            {regLoader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.BlackBtnLabel}>
                {componentData?.createAnAccountBtnLabel}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        {continueAsGuestBtn()}
        {renderSocialLoginBlocks()}
        {renderTermsAndConditions()}
      </>
    ) : (
      <View style={styles.successMsgContainer}>
        <View>
          <LottieView
            source={require('./success.json')}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={{
              width: 150,
              height: 150,
            }}
          />
        </View>
        <View>
          <Text style={styles.successTitle}>
            {componentData?.registrationSuccessTitle}
          </Text>
        </View>
        <View>
          <Text style={styles.successMsg}>
            {componentData?.registrationSuccessMsg}
          </Text>
        </View>
      </View>
    );
  };

  const renderSigninWithEmailForm = () => {
    const { componentData } = loginScreen;
    return (
      <>
        <View>
          <TextInput
            placeholderTextColor={colors.grey_8}
            // autoFocus={!props.noAutoFocusSignInInput} // To Avoid Auto focus, when coming from cart screen
            style={[
              styles.Input,
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
        </View>

        {renderErrorMsg('email')}

        <View style={{ position: 'relative' }}>
          <TextInput
            placeholderTextColor={colors.grey_8}
            style={[
              styles.Input,
              inputValidationErorrMsg?.id === 'password'
                ? styles.errorrInput
                : null,
            ]}
            onChangeText={(value) => {
              setPassword(value);
              clearErrorMsg('password');
            }}
            value={password}
            placeholder={componentData?.passwordPlaceholderTitle}
            keyboardType="default"
            secureTextEntry={!showPassword}
          />
          <View style={styles.PasswordIconContainer}>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <PasswordHide height={15} width={20} />
              ) : (
                <PasswordView height={15} width={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {renderErrorMsg('password')}

        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsEnableForgotPassword(true)}
          >
            <Text style={styles.ForgotPassLink}>
              {componentData?.forgotPasswordLinkLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {signinWithEmailErorrMsg
          ? renderFinalErrorMsg(signinWithEmailErorrMsg)
          : null}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            signInWithEmailHandler();
          }}
        >
          <View style={[styles.BlackBtn, { marginTop: 9 }]}>
            {regLoader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.BlackBtnLabel}>
                {componentData?.continueBtnLabel}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        {continueAsGuestBtn()}
        {renderSocialLoginBlocks()}
        {renderTermsAndConditions()}
        <TouchableOpacity
          onPress={() => {
            setIsSignInWithMobile(true);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.WhiteBtn}>
            <Text style={styles.WhiteBtnLabel}>
              {componentData?.useYourMobileNumbertoSigninBtnLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderErrorMsg = (id) => {
    return inputValidationErorrMsg?.id === id ? (
      <View>
        <Text style={[styles.errorrMsg]}>{inputValidationErorrMsg?.msg}</Text>
      </View>
    ) : (
      <View style={{ marginBottom: 16 }} />
    );
  };

  const renderFinalErrorMsg = (msg) => {
    return msg ? (
      <View>
        <Text style={[styles.errorrMsg]}>{msg}</Text>
      </View>
    ) : (
      <View style={{ marginBottom: 16 }} />
    );
  };

  const renderNameErrorMsg = (id) => {
    return inputValidationErorrMsg?.id === id ? (
      <View>
        <Text style={[styles.halfErrorrMsg]}>
          {inputValidationErorrMsg?.msg}
        </Text>
      </View>
    ) : (
      <View style={{ marginBottom: 16 }} />
    );
  };

  const clearErrorMsg = (id) => {
    if (inputValidationErorrMsg.id === id) {
      setInputValidationErorrMsg({ id: null, msg: null });
    }
  };

  const renderSignInWithMobileForm = () => {
    const { componentData, config } = loginScreen;

    return (
      <>
        {!isOtpSent ? (
          <>
            <View style={styles.MobileInputContainer}>
              <View style={styles.CountryCode}>
                <Text style={styles.CountryCodeLabel}>
                  {config?.countryCode[country]}
                </Text>
              </View>
              <View>
                <TextInput
                  placeholderTextColor={colors.grey_8}
                  autoFocus
                  style={[
                    styles.MobileInput,
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
                  maxLength={9}
                />
              </View>
            </View>
            {renderErrorMsg('mobile')}

            <TouchableOpacity
              onPress={() => {
                signInWithMobileHandler(mobile);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.BlackBtn}>
                {otpLoader ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.BlackBtnLabel}>
                    {componentData?.sendOTPLabel}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View>
              <TextInput
                placeholderTextColor={colors.grey_8}
                style={[
                  styles.Input,
                  inputValidationErorrMsg?.id === 'otp'
                    ? styles.errorrInput
                    : null,
                ]}
                onChangeText={(value) => {
                  setOtp(value);
                  clearErrorMsg('otp');
                }}
                value={otp}
                placeholder={componentData?.enterOTPPlaceholderTitle}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            {signinWithMobileErorrMsg
              ? renderFinalErrorMsg(signinWithMobileErorrMsg)
              : renderErrorMsg('otp')}
            <View>
              <TouchableOpacity
                onPress={() => {
                  resendLoginOTP();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.ResendOtpLink}>
                  {componentData?.resendOTPLabel}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                signInWithMobileVerify();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.BlackBtn}>
                {signInLoader ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.BlackBtnLabel}>
                    {componentData?.verifyLabel}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}

        {continueAsGuestBtn()}
        {renderSocialLoginBlocks()}
        {renderTermsAndConditions()}

        <TouchableOpacity
          onPress={() => {
            setIsSignInWithMobile(false);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.WhiteBtn}>
            <Text style={styles.WhiteBtnLabel}>
              {componentData?.useYourEmailIdToSignInBtnLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderSocialLoginBlocks = () => {
    const { componentData } = loginScreen;

    return (
      <>
        <View style={{ marginTop: 25 }}>
          <Text style={styles.OrSignInWithLabel}>{componentData?.orLabel}</Text>
          <Text style={styles.OrSignInWithLabel}>
            {componentData?.signinWithLabel}
          </Text>
        </View>

        <View style={styles.SocialLoginIconRow}>
          <TouchableOpacity
            onPress={() => onPressSigninWithGoogle()}
            activeOpacity={0.7}
          >
            <View style={styles.SocialLoginIconItem}>
              <Google height={35} width={35} />
            </View>
          </TouchableOpacity>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              onPress={() => onAppleButtonPress()}
              activeOpacity={0.7}
            >
              <View style={styles.SocialLoginIconItem}>
                <Apple height={45} width={45} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </>
    );
  };

  const renderTabs = () => {
    const { componentData } = loginScreen;

    return (
      !isRegSuccess &&
      !isEnableForgotPassword &&
      !isContinueAsGuest && (
        <View style={styles.TabRow}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setIsSignIn(true);
                resetState();
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.TabBtn, isSignIn ? styles.TabBtnSelected : null]}
              >
                {componentData?.signInTabLabel}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                setIsSignIn(false);
                resetState();
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.TabBtn,
                  !isSignIn ? styles.TabBtnSelected : null,
                ]}
              >
                {componentData?.registerTabLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    );
  };

  const renderQuickAccessSection = () => {
    const { componentData } = loginScreen;

    return (
      <>
        <View>
          <Text style={styles.SocialLoginTitle}>
            {componentData?.quickAccessWithLabel}
          </Text>
        </View>
        <View style={[styles.Seperator, { marginTop: 15 }]} />

        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            onPress={() => onAppleButtonPress()}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.SocialBtn,
                {
                  paddingLeft: 10,
                  marginBottom: 12,
                  minWidth: '70%',
                },
              ]}
            >
              <View>
                <Apple height={27} width={27} />
              </View>
              <View>
                <Text style={[styles.SocialBtnLabel]}>
                  {componentData?.signInWithAppleBtnLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => onPressSigninWithGoogle()}
          activeOpacity={0.7}
        >
          <View style={[styles.SocialBtn, { minWidth: '70%' }]}>
            <View>
              <Google height={23} width={23} />
            </View>
            <View>
              <Text style={styles.SocialBtnLabel}>
                {componentData?.signInWithGoogleBtnLabel}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <Text style={styles.ViewMoreOptionLabel}>
            {componentData?.viewMoreLabel}{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                textTransform: 'lowercase',
              }}
              onPress={() => setIsShowMoreOption(true)}
            >
              {componentData?.signInTabLabel}
            </Text>{' '}
            {componentData?.optionsLabel}
          </Text>
        </View>

        {renderTermsAndConditions()}
      </>
    );
  };

  const renderCloseBtn = () => {
    return (
      <View style={styles.CloseBtn}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setIsModalVisible(false);
            toggleSigninModal();
          }}
        >
          <View>
            <Close height={28} width={28} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLogo = () => {
    return (
      <>
        <View style={styles.Logo}>
          <Logo />
        </View>
        <View style={styles.Seperator} />
      </>
    );
  };

  const resetState = () => {
    setEmail(null);
    setPassword(null);
    setShowPassword(false);
    setIsSignInWithMobile(false);
    setMobile(false);
    setIsOtpSent(false);
    setOtp(null);
    setFirstName(null);
    setLastName(null);
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setSigninWithEmailErorrMsg(null);
    setRegErorrMsg(null);
    setOtpLoader(false);
    setRegLoader(false);
    setSigninWithMobileErorrMsg(null);
    setIsRegSuccess(false);
    setInputValidationErorrMsg({ id: null, msg: null });
    setIsEnableForgotPassword(false);
  };

  const closeResetPassword = () => {
    setIsEnableForgotPassword(false);
  };

  const closeContinueAsGuest = () => {
    setIsContinueAsGuest(false);
    setIsEnableForgotPassword(false);
  };

  const disableMoreOption = () => {
    setIsShowMoreOption(false);
  };

  const { toggleSigninModal, navigation } = props;

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={false}
      closeOnPressMask={true}
      shouldMeasureContentHeight={true}
      onClose={() => {
        toggleSigninModal();
        setIsModalVisible(false);
      }}
      customStyles={{
        wrapper: {
          backgroundColor: '#000000B3',
        },
        container: styles.ModalContainer,
      }}
    >
      <Spinner visible={showFullScreenLoader} />
      <ScrollView
        contentContainerStyle={[styles.contentContainer]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {renderCloseBtn()}
        {!isShowMoreOption ? (
          renderQuickAccessSection()
        ) : (
          <>
            {renderLogo()}
            {renderTabs()}
            {!isContinueAsGuest ? (
              isSignIn ? (
                isSignInWithMobile ? (
                  renderSignInWithMobileForm()
                ) : isEnableForgotPassword ? (
                  <>
                    <ResetPassword closeResetPassword={closeResetPassword} />
                    {renderSocialLoginBlocks()}
                    {renderTermsAndConditions()}
                  </>
                ) : (
                  renderSigninWithEmailForm()
                )
              ) : (
                renderRegistrationForm()
              )
            ) : (
              <>
                <ContinueAsGuestForm
                  closeContinueAsGuest={closeContinueAsGuest}
                  navigation={navigation}
                  toggleSigninModal={toggleSigninModal}
                  disableMoreOption={disableMoreOption}
                />
                {renderSocialLoginBlocks()}
                {renderTermsAndConditions()}
              </>
            )}
          </>
        )}
      </ScrollView>
    </RBSheet>
  );
};

export default LoginRegisterScreen;
