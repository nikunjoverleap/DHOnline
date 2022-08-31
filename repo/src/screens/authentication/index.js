import React, { useState } from 'react';
import Block from '../../components/Block';
import Text from '../../components/Text';
import Modal from 'react-native-modal';
import Close from '../../../assets/svg/Close.svg';

import { TouchableOpacity } from 'react-native';

import { SignUp } from './SignUp';
import { ActionButton } from '../../components/ActionButton';
import { SigninWithOtp } from './SigninWithOtp';
import { SigninWithEmail } from './SigninWithEmail';
import { ForgotPassword } from './ForgotPassword';
import { MobileNumberOTPVerify } from './MobileNumberOTPVerify';
import { SocialLogin } from './SocialLogin';
import { CheckoutAsGuest } from './CheckoutAsGuest';

export const Login = ({ navigation, onModalClose, isShowModal }) => {
  const [isSigninWithOtp, setIsSigninWithOtp] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isMobileNumberVerification, setIsMobileNumberVerification] =
    useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isCheckoutAsGuest, setIsCheckoutAsGuest] = useState(false);

  return (
    <Modal
      isVisible={isShowModal}
      onBackdropPress={onModalClose}
      onBackButtonPress={onModalClose}
      animationIn={'slideInUp'}
      animationOutTiming={500}
      backdropTransitionOutTiming={0}
      hasBackdrop={true}
      backdropOpacity={0.3}
    >
      <Block
        flex={false}
        width={'100%'}
        padding={[10, 0, 10, 0]}
        radius={7}
        color={'white'}
      >
        <Block
          flex={false}
          padding={[0, 10, 0, 10]}
          style={{ alignItems: 'flex-end' }}
        >
          <TouchableOpacity onPress={onModalClose}>
            <Close height={17} width={17} />
          </TouchableOpacity>
        </Block>
        {isForgotPassword ? (
          <>
            <ForgotPassword
              onPressRememberLogin={() => setIsForgotPassword(false)}
            />
          </>
        ) : isCheckoutAsGuest ? (
          <CheckoutAsGuest
            navigation={navigation}
            onPressCancelButton={() => {
              setIsCheckoutAsGuest(false);
            }}
            onModalClose={onModalClose}
          />
        ) : (
          <>
            {isSignUp ? (
              <SignUp
                onModalClose={onModalClose}
                onExistingUserPress={() => setIsSignUp(false)}
              />
            ) : (
              <>
                <Block flex={false} center>
                  <Text
                    size={14}
                    style={{ fontWeight: '600', marginBottom: 10 }}
                  >
                    SIGN IN WITH MOBILE/EMAIL ADDRESS
                  </Text>
                </Block>
                {isSigninWithOtp ? (
                  <>
                    {/* {======================= SigninWithOtp ========================} */}
                    {isMobileNumberVerification ? (
                      <MobileNumberOTPVerify
                        mobileNumber={mobileNumber}
                        OnCancelPress={() =>
                          setIsMobileNumberVerification(false)
                        }
                        onModalClose={() => onModalClose(true)}
                      />
                    ) : (
                      <SigninWithOtp
                        OnCancelPress={() => setIsSigninWithOtp(false)}
                        onSendVerificationCode={(mobileNumber) => {
                          setIsMobileNumberVerification(true),
                            setMobileNumber(mobileNumber);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* {======================= SigninWithEmail ========================} */}
                    <SigninWithEmail
                      onPressSignInWithOtp={() => setIsSigninWithOtp(true)}
                      onPressSignInWithEmail={() => setIsSigninWithOtp(false)}
                      onForgotPasswordPress={() => setIsForgotPassword(true)}
                      onModalClose={() => onModalClose(true)}
                    />
                  </>
                )}

                {/* {=================== Register Here ====================} */}
                {!isMobileNumberVerification && (
                  <ActionButton
                    onPress={() => setIsSignUp(true)}
                    buttonColor={'#FFFFFF'}
                    labelStyle={{
                      color: '#DD1B28',
                      fontSize: 14,
                    }}
                    buttonStyle={{
                      borderWidth: 1,
                      borderColor: 'rgba(200,200,200,1)',
                      borderRadius: 1,
                      width: '95%',
                    }}
                    label={'New to Danube home? Register Here'}
                  />
                )}
              </>
            )}

            {!isMobileNumberVerification && <SocialLogin />}

            {!isSigninWithOtp && !isMobileNumberVerification && !isSignUp && (
              <>
                <Block
                  flex={false}
                  height={1}
                  width={'95%'}
                  color={'rgba(200,200,200,1)'}
                  selfcenter
                  margin={[10, 0, 15, 0]}
                />
                <ActionButton
                  onPress={() => {
                    setIsCheckoutAsGuest(true);
                  }}
                  buttonColor={'#FFFFFF'}
                  labelStyle={{
                    color: '#000000',
                    fontSize: 14,
                  }}
                  buttonStyle={{
                    borderWidth: 1,
                    borderColor: 'rgba(200,200,200,1)',
                    borderRadius: 1,
                    width: '95%',
                  }}
                  label={'Or Just'}
                  secondLabel={' checkout as Guest'}
                  secondLabelStyle={{
                    color: '#3a9c0a',
                    fontSize: 14,
                    fontFamily: 'Roboto-Bold',
                  }}
                />
              </>
            )}
          </>
        )}
      </Block>
    </Modal>
  );
};
