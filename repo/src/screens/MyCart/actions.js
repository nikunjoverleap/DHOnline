import ApolloClientMagento from '../../ApolloClientMagento';
import { addShippingInfoEvent } from '../../helper/cart';
import { apiResponseLog } from '../../helper/Global';
import {
  ADD_TO_CART,
  ADD_TO_CART_CUSTOMER,
  APPLY_COUPON,
  APPLY_STORE_CREDIT,
  CHECKOUT_AS_GUEST,
  CREATE_CUSTOMER_NEW_ADDRESS,
  PLACE_ORDER_ACTUAL,
  REMOVE_CART_ITEM,
  REMOVE_CART_ITEM_CUSTOMER,
  REMOVE_COUPON,
  REMOVE_STORE_CREDIT,
  RESTORE_CART,
  SAVE_ADDRESS_INFO_TO_CART,
  SET_DEFAULT_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
} from '../../helper/gql';
import {
  CUSTOMER_WALLET,
  ESTIMATED_SHIPPING_COST,
  GET_CART_PAYMNENT_METHOD_WITHOUT_PARAM,
  GET_CART_PAYMNENT_METHOD_WITH_PARAM,
  GUEST_ESTIMATED_SHIPPING_COST,
  SAVE_TO_WISHLIST,
  SET_PAYMENT_METHOD,
  VIEW_CART_CUSTOMER,
} from '../../helper/gql/query';
import useApiErrorsHandler from '../../helper/useApiErrorHandler';
import { setPWAGuestToken } from '../../slicers/auth/authSlice';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import { createEmptyCart } from '../InvisibleScreen/actions';

export const addToCart = () => {
  try {
  } catch (e) {}
};

const handleApiError = useApiErrorsHandler();

export const applyCoupon = async (couponData) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: APPLY_COUPON,
      variables: couponData,
    });
    apiResponseLog(
      'APPLY_COUPON',
      {
        coupon_code: couponData,
      },
      data
    );
    return { data: data };
  } catch (error) {
    apiResponseLog(
      'APPLY_COUPON',
      {
        coupon_code: couponData,
      },
      {},
      error
    );
    return { error: error };
  }
};

export const removeCoupon = async (couponData) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: REMOVE_COUPON,
      variables: couponData,
    });
    apiResponseLog('REMOVE_COUPON', {}, data);
    return { data: data };
  } catch (error) {
    apiResponseLog('REMOVE_COUPON', {}, {}, error);
    return { error: error };
  }
};

export const applyStoreCredit = async () => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: APPLY_STORE_CREDIT,
      fetchPolicy: 'network-only',
    });
    apiResponseLog('APPLY_STORE_CREDIT', {}, data);
    return { data };
  } catch (error) {
    apiResponseLog('APPLY_STORE_CREDIT', {}, {}, error);
    return { error };
  }
};

export const removeStoreCredit = async () => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: REMOVE_STORE_CREDIT,
      fetchPolicy: 'network-only',
    });
    apiResponseLog('REMOVE_STORE_CREDIT', {}, data);
    return { data };
  } catch (error) {
    apiResponseLog('REMOVE_STORE_CREDIT', {}, {}, error);
    return { error };
  }
};

export const getCartPayment = async () => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_CART_PAYMNENT_METHOD_WITHOUT_PARAM,
      fetchPolicy: 'network-only',
    });
    apiResponseLog('GET_CART_PAYMNENT_METHOD_WITHOUT_PARAM', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('GET_CART_PAYMNENT_METHOD_WITHOUT_PARAM', {}, {}, error);
  }
};

export const getCartPaymentWithParam = async (token) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_CART_PAYMNENT_METHOD_WITH_PARAM,
      fetchPolicy: 'network-only',
      variables: {
        guestCartId: token,
      },
    });
    apiResponseLog(
      'GET_CART_PAYMNENT_METHOD_WITH_PARAM',
      {
        guestCartId: token,
      },
      data
    );
    return data;
  } catch (error) {
    apiResponseLog(
      'GET_CART_PAYMNENT_METHOD_WITH_PARAM',
      {
        guestCartId: token,
      },
      {},
      error
    );
  }
};

export const estimatedShippingCost = async (addressData) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: ESTIMATED_SHIPPING_COST,
      variables: {
        _address_0: addressData,
      },
    });
    apiResponseLog('ESTIMATED_SHIPPING_COST', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('ESTIMATED_SHIPPING_COST', {}, {}, error);
  }
};

export const guestEstimatedShippingCost = async (addressData, guestCartId) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: GUEST_ESTIMATED_SHIPPING_COST,
      variables: {
        _address_0: addressData,
        _guestCartId_0: guestCartId,
      },
    });
    apiResponseLog('GUEST_ESTIMATED_SHIPPING_COST', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('GUEST_ESTIMATED_SHIPPING_COST', {}, {}, error);
  }
};

export const customerWallet = async (token, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: CUSTOMER_WALLET,
    });
    apiResponseLog('CUSTOMER_WALLET', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('CUSTOMER_WALLET', {}, {}, error);
  }
};

export const setPaymentMethod = async (
  userToken,
  pwaGuestToken,
  paymentMethod
) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: SET_PAYMENT_METHOD,
      variables: {
        paymentMethod_input: {
          guest_cart_id: userToken ? '' : pwaGuestToken,
          payment_method: {
            code: paymentMethod,
          },
        },
      },
    });
    apiResponseLog(
      'SET_PAYMENT_METHOD',
      {
        guest_cart_id: userToken ? '' : pwaGuestToken,
        payment_method: {
          code: paymentMethod,
        },
      },
      data
    );
    return data;
  } catch (error) {
    apiResponseLog(
      'SET_PAYMENT_METHOD',
      {
        guest_cart_id: userToken ? '' : pwaGuestToken,
        payment_method: paymentMethod,
      },
      {},
      error
    );
  }
};

export const createCustomerNewAddress = async (data, cartItems) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: CREATE_CUSTOMER_NEW_ADDRESS,
      variables: {
        customer_address_data: data,
      },
    });
    addShippingInfoEvent({ cartItems });
    apiResponseLog(
      'CREATE_CUSTOMER_NEW_ADDRESS',
      {
        customer_address_data: data,
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'CREATE_CUSTOMER_NEW_ADDRESS',
      {
        customer_address_data: data,
      },
      {},
      error
    );
  }
};

export const saveCartItemCustomer = async (data, dispatch) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: ADD_TO_CART_CUSTOMER,
      variables: {
        cartItem: data,
      },
    });
    apiResponseLog(
      'ADD_TO_CART_CUSTOMER',
      {
        cartItem: data,
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'ADD_TO_CART_CUSTOMER',
      {
        cartItem: data,
      },
      {},
      error
    );
    handleApiError(error);
    return { error, data };
  }
};

export const saveCartItem = async (data, pwaGuestToken) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: ADD_TO_CART,
      variables: {
        cartItem: data,
        guestCartId: pwaGuestToken,
      },
    });
    apiResponseLog(
      'ADD_TO_CART',
      {
        cartItem: data,
        guestCartId: pwaGuestToken,
      },
      {},
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'ADD_TO_CART',
      {
        cartItem: data,
        guestCartId: pwaGuestToken,
      },
      {},
      error
    );
    handleApiError(error);
    return error;
  }
};

export const removeCartItemCustomer = async (data) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: REMOVE_CART_ITEM_CUSTOMER,
      variables: {
        item_id: data,
      },
    });
    apiResponseLog(
      'REMOVE_CART_ITEM_CUSTOMER',
      {
        item_id: data,
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'REMOVE_CART_ITEM_CUSTOMER',
      {
        item_id: data,
      },
      {},
      error
    );
  }
};

export const removeCartItem = async (itemId, pwaGuestToken) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: REMOVE_CART_ITEM,
      variables: {
        item_id: itemId,
        guestCartId: pwaGuestToken,
      },
    });
    apiResponseLog(
      'REMOVE_CART_ITEM',
      {
        item_id: itemId,
        guestCartId: pwaGuestToken,
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'REMOVE_CART_ITEM',
      {
        item_id: itemId,
        guestCartId: pwaGuestToken,
      },
      {},
      error
    );
  }
};

export const saveToWishlist = async (itemData) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: SAVE_TO_WISHLIST,
      variables: {
        wishlistItem: itemData,
      },
    });
    apiResponseLog(
      'SAVE_TO_WISHLIST',
      {
        wishlistItem: itemData,
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'SAVE_TO_WISHLIST',
      {
        wishlistItem: itemData,
      },
      {},
      error
    );
  }
};

export const updateCustomerAddress = async (addressId, addressData) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: UPDATE_CUSTOMER_ADDRESS,
      variables: {
        _id_0: addressId,
        _input_0: addressData,
      },
    });
    apiResponseLog(
      'UPDATE_CUSTOMER_ADDRESS',
      {
        variables: {
          _id_0: addressId,
          _input_0: addressData,
        },
      },
      res
    );
    return res;
  } catch (error) {
    apiResponseLog(
      'UPDATE_CUSTOMER_ADDRESS',
      {
        variables: {
          _id_0: addressId,
          _input_0: addressData,
        },
      },
      {},
      error
    );
  }
};

export const saveAddressInfoToCart = async (addressInfo) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: SAVE_ADDRESS_INFO_TO_CART,
      variables: addressInfo,
    });
    apiResponseLog('SAVE_ADDRESS_INFO_TO_CART', addressInfo, res);
    return { saveAddressRes: res };
  } catch (error) {
    apiResponseLog(
      'SAVE_ADDRESS_INFO_TO_CART',
      addressInfo,
      {
        saveAddressErr: error,
      },
      error
    );
    return { saveAddressErr: error };
  }
};

export const setGuestEmailOnCart = async (guestData) => {
  try {
    await ApolloClientMagento.mutate({
      mutation: CHECKOUT_AS_GUEST,
      variables: { guestData },
    });
  } catch (e) {
    apiResponseLog('setGuestEmailOnCart', guestData, {}, e);
    // logError(error);
  }
};

export const placeOrder = async (addressData) => {
  try {
    const data = await ApolloClientMagento.mutate({
      mutation: PLACE_ORDER_ACTUAL,
      variables: addressData,
    });
    apiResponseLog(
      'PLACE_ORDER',
      {
        variables: addressData,
      },
      data
    );
    return { data: data };
  } catch (error) {
    apiResponseLog(
      'PLACE_ORDER',
      {
        variables: addressData,
      },
      {},
      error
    );
    return { error: error };
  }
};

export const restoreCart = async (incrementId) => {
  try {
    const data = await ApolloClientMagento.mutate({
      mutation: RESTORE_CART,
      variables: {
        orderId: incrementId,
      },
    });
    apiResponseLog(
      'RESTORE_CART',
      {
        orderId: incrementId,
      },
      data
    );

    return data;
  } catch (error) {
    apiResponseLog(
      'RESTORE_CART',
      {
        orderId: incrementId,
      },
      {},
      error
    );
    return { error: error };
  }
};

export const resetQuestQuoteInCaseThereAErrorInTheCart = async (dispatch) => {
  try {
    const viewCartForCustomer = await createEmptyCart();
    if (viewCartForCustomer?.createEmptyCart) {
      dispatch(setPWAGuestToken(viewCartForCustomer?.createEmptyCart));
    }
    return viewCartForCustomer?.createEmptyCart;
  } catch (e) {
    apiResponseLog('resetQuestQuoteInCaseThereAErrorInTheCart', {}, {}, e);
  }
};

export const setDefaultAddress = async (addressId, addressData) => {
  try {
    const res = await ApolloClientMagento.mutate({
      mutation: SET_DEFAULT_ADDRESS,
      variables: {
        _id_0: addressId,
        _input_0: addressData,
      },
    });
  } catch (e) {
    apiResponseLog('SET_DEFAULT_ADDRESS', { addressId, addressData }, {}, e);
  }
};

export const getCustomerCartData = async (dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: VIEW_CART_CUSTOMER,

      fetchPolicy: 'no-cache',
    });
    dispatch(setUserCartItems(data));
    return { data };
  } catch (e) {
    apiResponseLog('VIEW_CART_CUSTOMER', null, {}, e);
    return { error: e };
  }
};
