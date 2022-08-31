import React from 'react';
import Block from '../../components/Block';
import Text from '../../components/Text';
import Facebook from '../../../assets/svg/Facebook.svg';
import Google from '../../../assets/svg/Google.svg';
import { Platform, TouchableOpacity } from 'react-native';
import { AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { apiResponseLog, logError } from '../../helper/Global';
import { env } from '../../src/config/env';
import { setUserToken } from '../../slicers/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { GENERATE_CUSTOMER_TOKEN_BY_FIREBASE } from '../../helper/gql/query';

export const SocialLogin = () => {
  const dispatch = useDispatch();
  const [generateCustomerTokenByFirebase] = useLazyQuery(
    GENERATE_CUSTOMER_TOKEN_BY_FIREBASE
  );

  const onSuccessSocialLogin = async (token) => {
    let variablesData = {
      variables: {
        token: token,
      },
    };

    try {
      const { data } = await generateCustomerTokenByFirebase({
        variables: {
          token: token,
        },
      });

      apiResponseLog(
        'GENERATE_CUSTOMER_TOKEN_BY_FIREBASE',
        variablesData?.variables,
        data
      );

      await AsyncStorage.setItem(
        'DH_ONLINE_USER_TOKEN',
        data?.generateCustomerTokenByFirebase?.token
      );
      dispatch(setUserToken(data?.generateCustomerTokenByFirebase?.token));
    } catch (error) {
      apiResponseLog(
        'GENERATE_CUSTOMER_TOKEN_BY_FIREBASE',
        variablesData?.variables,
        error
      );
    }
  };

  const onPressSigninWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      onSuccessSocialLogin(userInfo?.idToken);
    } catch (error) {
      logError(error);
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

  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      onSuccessSocialLogin(appleAuthRequestResponse?.identityToken);
    }
  };

  const onPressFacebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          logInfo('Login cancelled');
        } else {
          getFacebookUserData();
        }
      },
      function (error) {
        logInfo('Login fail with error: ' + error);
      }
    );
  };

  const getFacebookUserData = () => {
    {
      /* { =================== Token =================== } */
    }
    AccessToken.getCurrentAccessToken().then((res) => {
      onSuccessSocialLogin(res.accessToken.toString());
    });

    {
      /* { =================== Details =================== } */
    }
    const currentProfile = Profile.getCurrentProfile().then(function (
      currentProfile
    ) {
      if (currentProfile) {
        // logInfo('currentProfile ======> ', currentProfile);
      }
    });
  };

  return (
    <>
      {/* {=================== Sign in with social media ====================} */}
      <Block flex={false} center margin={[10, 10, 10, 10]} style={{}}>
        <Text size={12} style={{ fontWeight: '600' }}>
          SIGN IN WITH SOCIAL MEDIA
        </Text>
      </Block>
      <Block flex={false} center middle row margin={[5, 0, 5, 0]}>
        {/* {=================== Google ====================} */}
        <Block
          flex={false}
          height={50}
          width={50}
          // color={'rgb(232, 240, 254)'}
          center
          middle
        >
          <TouchableOpacity
            onPress={() => onPressSigninWithGoogle()}
            style={{ height: 30, width: 30 }}
          >
            <Google height={'100%'} width={'100%'} />
          </TouchableOpacity>
        </Block>

        {/* {=================== Facebook ====================} */}
        <Block
          flex={false}
          height={50}
          width={50}
          // color={'rgb(232, 240, 254)'}
          center
          middle
          style={{ left: 10 }}
        >
          <TouchableOpacity
            onPress={() => onPressFacebookLogin()}
            style={{ height: 30, width: 30 }}
          >
            <Facebook height={'100%'} width={'100%'} />
          </TouchableOpacity>
        </Block>

        {/* {=================== APPLE ====================} */}
        {Platform.OS === 'ios' ? (
          <Block
            flex={false}
            height={50}
            width={50}
            // color={'rgb(232, 240, 254)'}
            center
            middle
            style={{ left: 20 }}
          >
            <Block
              center
              middle
              style={{ height: 40, width: 50, overflow: 'hidden' }}
            >
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: 50, // You must specify a width
                  height: 120, // You must specify a height
                  padding: 0,
                }}
                onPress={() => onAppleButtonPress()}
              />
            </Block>
          </Block>
        ) : null}
      </Block>
    </>
  );
};
