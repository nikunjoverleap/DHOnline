import { useLazyQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import base64 from 'react-native-base64';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SvgUri } from 'react-native-svg';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import ApolloClientMagento from '../../ApolloClientMagento';
import Block from '../../components/Block';
import PaymentProcessingModal from '../../components/Modals/PymentProcessingModal';
import Text from '../../components/Text';
import {
  DH_ONLINE_GUEST_EMAIL,
  EVENT_NAME_PAYMENT_FAILED,
  EVENT_NAME_PAYMENT_USER_ABORTED,
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  GENERIC_ERROR_MESSAGE,
  SCREEN_NAME_CHECKOUT,
  SCREEN_NAME_PAYMENT,
  SCREEN_NAME_PAYMENT_PROCESSING,
} from '../../constants';
import {
  Analytics_Events,
  logError,
  logInfo,
  showToast,
} from '../../helper/Global';
import { CHECKOUT_AS_GUEST } from '../../helper/gql';
import Toast from 'react-native-toast-message';
import {
  VERIFY_PAYMENT_CAPTURED,
  VIEW_CART_CUSTOMER,
  VIEW_CART_GUEST,
} from '../../helper/gql/query';
import { setPWAGuestToken } from '../../slicers/auth/authSlice';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import { restoreCart } from './actions';
import {
  PAYMENT_DECLINED_TOAST,
  PAYMENT_METHOD_COMPONENT,
  SHIPPING_METHOD_COMPONENT,
} from './constants';
import { getOrderConfirmationDetails } from '../OrderConfirmation/actions';
import { URL } from 'react-native-url-polyfill';

let navigationDebounceTimer;

function CreateSummary({ navigation, route }) {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [paymentProcessingShown, setPaymentProcessingShown] = useState(false);
  const [isWebViewLoaderVisible, setIsWebViewLoaderVisible] = useState(true);
  const [webURL, setWebURL] = useState('');
  const { userProfile, country, language, userToken, pwaGuestToken } =
    useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const screenChckout = screenSettings?.[SCREEN_NAME_CHECKOUT];
  const countryCode =
    screenChckout?.components?.[SHIPPING_METHOD_COMPONENT]?.config?.countryCode;
  const [nudgeVisible, setNudgeVisibele] = useState(false);

  const checkoutData = screenSettings?.[SCREEN_NAME_CHECKOUT]?.components;
  const paymentFailureToastLabels =
    checkoutData?.[PAYMENT_DECLINED_TOAST]?.componentData;
  const checkoutConfig = checkoutData?.[PAYMENT_METHOD_COMPONENT]?.config;
  const {
    payfortPurchaseSuccessUrl,
    payfortPurchaseFailureUrl,
    postpayPurchaseUrl,
    spottiPurchaseUrl,
    tapPurchaseUrl,
  } = checkoutConfig;

  const {
    orderId,
    paymentCode,
    cartItems,
    incrementId,
    orderToken,
    shipping_city,
    shipping_line1,
    threeDSecureUrl = '',
  } = route?.params || {};
  const dispatch = useDispatch();

  const handleCancelPayment = async () => {
    setIsWebViewLoaderVisible(true);
    await handleRestoreCartAPI({ navigateBack: true });
    handlePaymentAbortedEvents({
      reason: 'USER_CLICK_BACK_BUTTON',
      method: paymentCode,
      orderNumber: incrementId,
    });
    // navigation.pop(1);
    // to do show loader
  };

  useEffect(() => {
    if (nudgeVisible) {
      Toast.show({
        autoHide: false,
        type: 'payment_failed_toast',
        props: {
          header: paymentFailureToastLabels?.header || '',
          description: paymentFailureToastLabels?.description || '',
          mainIcon: <SvgUri uri={paymentFailureToastLabels?.icon} />,
          onClose: () => {
            setNudgeVisibele(false);
          },
        },
      });
    } else {
      Toast.hide({
        type: 'payment_failed_toast',
      });
    }
  }, [nudgeVisible]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'white',
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => askCancelPayment()}
          style={styles.headerLeftButtonView}
        >
          <Image
            style={styles.backImageView}
            source={require('../../../assets/images/back.png')}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => <Text style={styles.paymentText}>Payment</Text>, // TODO Translation
    });
  };

  const askCancelPayment = () => {
    Alert.alert(
      'Are you sure?', // TODO translation
      'Do you want to the cancel the payment?', // TODO translation
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'OK',
          onPress: handleCancelPayment,
        },
      ],
      { cancelable: false }
    );
  };

  //TODO: check why this called in useffect
  useEffect(() => {
    if (pwaGuestToken) {
      getCartData();
    }
  }, [pwaGuestToken]);
  useEffect(() => {
    if (userToken) {
      getCustomerData();
    }
  }, [userToken]);

  const [getCartForCustomerData] = useLazyQuery(VIEW_CART_CUSTOMER, {
    client: ApolloClientMagento,
    fetchPolicy: 'no-cache',
  });

  const getCustomerData = async () => {
    try {
      const { data, error } = await getCartForCustomerData();
      if (error) {
        //   showToast({ message: error.message, type: 'error' });
        //   logError(error);
      } else {
        dispatch(setUserCartItems(data));
      }
    } catch (e) {
      showToast({
        message: GENERIC_ERROR_MESSAGE(language, e?.message),
        type: 'error',
      });
      logError(e);
    }
  };

  const [getCart] = useLazyQuery(VIEW_CART_GUEST);
  const getCartData = async () => {
    try {
      const { data } = await getCart({
        variables: { cart_id: pwaGuestToken },
      });
      if (data?.cartData?.items?.length) {
        dispatch(setUserCartItems(data));
      }
    } catch (e) {
      logError(e);
    }
  };

  const [checkoutAsGuest] = useMutation(CHECKOUT_AS_GUEST);

  const handleRestoreCartAPI = async ({
    navigateBack = false,
    message = '',
  } = {}) => {
    const res = await restoreCart(incrementId);
    const { data } = res || {};
    if (res) {
      if (userToken) {
        await getCustomerData();
      } else {
        if (data && data.restoreQuote) {
          dispatch(setPWAGuestToken(data.restoreQuote));
        }
        try {
          const email = await AsyncStorage.getItem(DH_ONLINE_GUEST_EMAIL);
          checkoutAsGuest({
            variables: {
              emailInput: {
                email,
                cart_id: data.restoreQuote,
              },
            },
          });
        } catch (e) {
          logError(e);
        }
      }
      // const { data } = await getCartForCustomerData();
      // getCustomerData;
      // dispatch(setUserCartItems(data));
      //  navigation.navigate('Home');
    }
    if (navigateBack) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    setNavigationBar();
    const amt = cartItems?.cartData?.subtotal_with_discount;
    const currency = cartItems?.cartData?.base_currency_code;
    const ref = orderId;
    const first_name = userProfile?.customer?.firstname;
    const last_name = userProfile?.customer?.lastname;
    const email = userProfile?.customer?.email;
    const phone = userProfile?.customer?.mobilenumber;

    if (paymentCode === 'tap') {
      const URL = `country=${country}&amt=${amt}&currency=${currency}&ref=${ref}&lang=${language}&first_name=${first_name}&last_name=${last_name}&email=${email}&phone=${phone}`;
      const data = base64.encode(URL);
      const webURL = `${tapPurchaseUrl}?paymentData=${data}`;
      setWebURL(webURL);
    } else if (paymentCode === 'postpay') {
      const PRICE_MULTIPLIER = 100;
      const cartData = cartItems?.cartData?.items.map(function (item) {
        return {
          reference: item?.sku,
          name: item?.name,
          unit_price: item?.price * PRICE_MULTIPLIER,
          qty: item?.qty,
        };
      });

      const postPayPaymentData = {
        order_id: incrementId,
        total_amount: cartItems?.cartData?.grand_total * PRICE_MULTIPLIER,
        tax_amount: 0,
        currency: cartItems?.cartData?.base_currency_code,
        country: country?.toUpperCase(country),
        country_code: countryCode?.[country],
        first_name,
        last_name,
        shipping_line1,
        shipping_city,
        email_id: email,
        phone,
        items: cartData,
      };

      const postPayRes = base64.encode(JSON.stringify(postPayPaymentData));
      const webURL = `${postpayPurchaseUrl}?paymentData=${postPayRes}`;
      setWebURL(webURL);
    } else if (paymentCode === 'spotiipay') {
      const spotiCartData = cartItems?.cartData?.items.map(function (item) {
        return {
          reference: item?.sku,
          sku: item?.sku,
          title: item?.name,
          upc: item?.sku,
          price: item?.price,
          image_url: item?.product?.thumbnail?.url,
          quantity: item?.qty,
        };
      });

      const spotiidata = {
        order_id: incrementId,
        total_amount: cartItems?.cartData?.grand_total,
        tax_amount: 0,
        currency: cartItems?.cartData?.base_currency_code,
        country: country?.toUpperCase(country),
        country_code: countryCode?.[country],
        first_name,
        last_name,
        shipping_line1,
        shipping_city,
        email_id: email,
        phone,
        items: spotiCartData,
      };
      const spotiiPayRes = base64.encode(JSON.stringify(spotiidata));
      const webURL = `${spottiPurchaseUrl}?paymentData=${spotiiPayRes}`;
      // Spotii
      setWebURL(webURL);
    } else if (paymentCode === 'payfort_fort_cc') {
      const webURL = threeDSecureUrl;
      // Spotii
      setWebURL(webURL);
    }
  }, []);

  const hideWebViewLoader = () => {
    setIsWebViewLoaderVisible(false);
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
      EventToken: 'tpm40f',
      params: {
        screen_name: SCREEN_NAME_PAYMENT,
        country,
        language,
        orderNumber: incrementId,
        paymentCode,
      },
    });
  };

  const getPaymentVerified = async (successId, paymentMethod) => {
    setShowProcessingModal(true);
    /** TO DO THIS CODE NEEDS TO BE REMOVED */
    if (paymentMethod === 'payfort_fort_cc') {
      setShowProcessingModal(true);
      const res = await getOrderConfirmationDetails(orderToken, dispatch);
      navigation.navigate('Thanks', {
        orderToken,
        orderId,
        incrementId,
      });
      setShowProcessingModal(false);
      return;
    }
    /**  TO DO THIS CODE NEEDS TO BE REMOVED AND IMPLEMENT DDS CALL */
    const { data, error } = await ApolloClientMagento.query({
      query: VERIFY_PAYMENT_CAPTURED,
      variables: {
        paymentMethod,
        paymentId: successId,
      },
      fetchPolicy: 'network-only',
    });

    if (data?.verifyPaymentCaptured) {
      const res = await getOrderConfirmationDetails(orderToken, dispatch);
      setShowProcessingModal(false);
      if (res) {
        navigation.navigate('Thanks', {
          orderToken,
          orderId,
          incrementId,
        });
        ReactNativeHapticFeedback.trigger('notificationSuccess');
      }
    }
    if (error) {
      setShowProcessingModal(false);
    }
  };

  const navigateToThanks = async () => {
    const res = await getOrderConfirmationDetails(orderToken, dispatch);
    if (res) {
      navigation.navigate('Thanks', {
        orderToken,
        orderId,
        incrementId,
      });
      ReactNativeHapticFeedback.trigger('notificationSuccess');
    }
  };

  const handlePaymentFailedEvents = ({
    reason = '',
    message = '',
    method = '',
    failureCode,
  }) => {
    Analytics_Events({
      eventName: EVENT_NAME_PAYMENT_FAILED,
      params: {
        reason,
        message,
        method,
        failureCode,
        orderNumber: incrementId,
      },
    });
  };
  const handlePaymentAbortedEvents = ({ reason = '' }) => {
    Analytics_Events({
      eventName: EVENT_NAME_PAYMENT_USER_ABORTED,
      params: {
        orderNumber: incrementId,
        reason,
        method: paymentCode,
      },
    });
  };

  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      EventToken: 'tpm40f',
      params: {
        screen_name: SCREEN_NAME_PAYMENT,
        country,
        language,
        orderNumber: incrementId,
        paymentCode,
      },
    });
  }, []);

  useEffect(() => {
    if (showProcessingModal && !paymentProcessingShown) {
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW,
        EventToken: 'tpm40f',
        params: {
          screen_name: SCREEN_NAME_PAYMENT_PROCESSING,
          country,
          language,
          orderNumber: incrementId,
          paymentCode,
        },
      });
      setPaymentProcessingShown(true);
    } else if (!showProcessingModal && paymentProcessingShown) {
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
        EventToken: 'tpm40f',
        params: {
          screen_name: SCREEN_NAME_PAYMENT_PROCESSING,
          country,
          language,
          orderNumber: incrementId,
          paymentCode,
        },
      });
    }
  }, [showProcessingModal]);

  return (
    <View style={styles.mainContiner}>
      <WebView
        onLoad={() => hideWebViewLoader()}
        source={{ uri: webURL }}
        onNavigationStateChange={(navigationState) => {
          logInfo('payment url:', navigationState.url, 'force');
          clearTimeout(navigationDebounceTimer);
          navigationDebounceTimer = setTimeout(() => {
            if (
              paymentCode === 'payfort_fort_cc' &&
              !navigationState.loading &&
              (navigationState.url.indexOf(`/${country}/${language}/`) !== -1 || // TODO TO BE COMMENTED
                navigationState.url.indexOf(payfortPurchaseSuccessUrl) !== -1)
            ) {
              let urlObj = new URL(navigationState.url);

              const tokenName = urlObj.searchParams.get('status');
              getPaymentVerified(tokenName, 'payfort_fort_cc'); // TODO
            } else if (
              paymentCode === 'payfort_fort_cc' &&
              !navigationState.loading &&
              navigationState.url.indexOf(payfortPurchaseFailureUrl) !== -1
            ) {
              Alert.alert(
                `Payment Failed: ${urlObj.searchParams.get('message')}`
              );
              handleRestoreCartAPI({
                navigateBack: true,
              });
              handlePaymentFailedEvents({
                failureCode: urlObj.searchParams.get('status'),
                reason: 'GATEWAY_FAILED',
                message: urlObj.searchParams.get('message'),
                method: 'payfort',
              });

              //navigateToThanks();
            } else if (
              !navigationState.loading &&
              // eslint-disable-next-line no-magic-numbers
              navigationState.url.indexOf('status=success') !== -1
            ) {
              if (paymentCode === 'tap') {
                const successId = navigationState.url?.split('id=')?.[1];
                getPaymentVerified(successId, 'TAP');
              } else {
                navigateToThanks();
              }
            } else if (
              !navigationState.loading &&
              // eslint-disable-next-line no-magic-numbers
              navigationState.url.indexOf('status=failure') !== -1
            ) {
              ReactNativeHapticFeedback.trigger('impactHeavy');
              Alert.alert('Payment failed!', 'Please try again.');
              handleRestoreCartAPI({ navigateBack: true });
              handlePaymentFailedEvents({
                failureCode: urlObj.searchParams.get('status'),
                reason: 'GATEWAY_FAILED',
                message: urlObj.searchParams.get('message'),
                method: paymentCode,
              });
            }
            // eslint-disable-next-line no-magic-numbers
          }, 500);
        }}
        onMessage={() => {}}
      />
      {isWebViewLoaderVisible && (
        <Block style={styles.loaderView}>
          <ActivityIndicator color={'black'} size={'large'} />
        </Block>
      )}
      <PaymentProcessingModal visible={showProcessingModal} />
    </View>
  );
}
export default CreateSummary;

const styles = StyleSheet.create({
  mainContiner: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderView: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
  },
  headerLeftButtonView: {
    height: 30,
    width: 20,
    marginLeft: 5,
  },
  backImageView: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    tintColor: 'black',
  },
  paymentText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
  },
});
