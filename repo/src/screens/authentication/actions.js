import AsyncStorage from '@react-native-async-storage/async-storage';
import ApolloClientMagento from '../../ApolloClientMagento';
import {
  DH_ONLINE_PWA_GUEST_TOKEN,
  DH_ONLINE_USER_TOKEN,
} from '../../constants';
import { apiResponseLog } from '../../helper/Global';
import { MERGE_CART } from '../../helper/gql';
import {
  GENERATE_CUSTOMER_TOKEN_BY_FIREBASE,
  GET_CUSTOMER_PROFILE,
  SAVE_TO_WISHLIST,
  VIEW_CART_CUSTOMER,
} from '../../helper/gql/query';
import {
  setPWAGuestToken,
  setUserProfile,
  setUserToken,
} from '../../slicers/auth/authSlice';

export const onSuccessSocialLogin = async (token, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GENERATE_CUSTOMER_TOKEN_BY_FIREBASE,
      variables: {
        token: token,
      },
    });

    apiResponseLog(
      'GENERATE_CUSTOMER_TOKEN_BY_FIREBASE',
      {
        token: token,
      },
      data
    );

    await getCustomerProfile(
      { token: data?.generateCustomerTokenByFirebase?.token },
      dispatch
    );
    dispatch(setUserToken(data?.generateCustomerTokenByFirebase?.token));
    await AsyncStorage.setItem(
      DH_ONLINE_USER_TOKEN,
      data?.generateCustomerTokenByFirebase?.token
    );
    const pwaGuestToken = await AsyncStorage.getItem(DH_ONLINE_PWA_GUEST_TOKEN);
    try {
      if (pwaGuestToken) {
        await mergeCart(pwaGuestToken, dispatch);
      }
    } catch (e) {
      apiResponseLog('mergeCart', { pwaGuestToken }, {}, e);
    }
  } catch (error) {
    apiResponseLog(
      'GENERATE_CUSTOMER_TOKEN_BY_FIREBASE',
      {
        token: token,
      },
      {},
      error
    );
  }
};

export const getCustomerProfile = async (
  { token, country, language, updateAnalytics },
  dispatch
) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_CUSTOMER_PROFILE,
      fetchPolicy: 'network-only',
    });
    dispatch(setUserProfile({ ...data, country, language, updateAnalytics }));
  } catch (error) {
    apiResponseLog(
      'GET_CUSTOMER_PROFILE',
      {
        token: token,
      },
      error
    );
  }
};

export const mergeCart = async (token, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: MERGE_CART,
      variables: {
        guestCartId: token,
      },
    });
    apiResponseLog(
      'MERGE_CART',
      {
        token: token,
      },
      data
    );

    dispatch(setPWAGuestToken());
    return data;
  } catch (error) {
    apiResponseLog(
      'MERGE_CART',
      {
        token: token,
      },
      {},
      error
    );
  }
};

export const viewCartCustomer = async (token, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: VIEW_CART_CUSTOMER,
    });
    apiResponseLog('VIEW_CART_CUSTOMER', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('VIEW_CART_CUSTOMER', {}, error);
  }
};
