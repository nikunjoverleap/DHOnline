import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Spinner from 'react-native-loading-spinner-overlay';
import { ApplePayButton } from 'react-native-payments';
import { SvgUri } from 'react-native-svg';
import { URL } from 'react-native-url-polyfill';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import BackArrow from '../../../assets/svg/cart-back-arrow.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import Block from '../../components/Block';
import CouponSuccessModal from '../../components/CouponSuccessModal';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import Seperator from '../../components/Seperator';
import {
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  EVENT_NAME_SCREEN_VIEW_ERROR,
  DH_ONLINE_GUEST_EMAIL,
  FONT_FAMILY_ENGLISH_REGULAR,
  GENERIC_ERROR_MESSAGE,
  SCREEN_NAME_CHECKOUT,
  SCREEN_NAME_MY_CART,
  EVENT_NAME_CHECKOUT_OPTION_SELECTED,
  EVENT_NAME_CHECKOUT_PAYMENT_FAILURE,
  EVENT_NAME_CUSTOM_CLICK,
} from '../../constants';
import {
  Analytics_Events,
  logError,
  logInfo,
  showToast,
} from '../../helper/Global';
import {
  getToken,
  makeApplePayRequest,
  makePayfortPurchase,
} from '../../helper/payment';
import { setPWAGuestToken } from '../../slicers/auth/authSlice';
import {
  addCartLoader,
  removeCartLoader,
  setDeliveryTypes,
  setPaymentTypes,
  setUserCartItems,
} from '../../slicers/checkout/checkoutSlice';
import colors from '../../styles/colors';
import AddressBody from '../AddressListingScreen/components/AddressBody';
import { getOrderConfirmationDetails } from '../OrderConfirmation/actions';
import {
  applyStoreCredit,
  customerWallet,
  estimatedShippingCost,
  getCartPayment,
  getCartPaymentWithParam,
  getCustomerCartData,
  guestEstimatedShippingCost,
  placeOrder,
  removeStoreCredit,
  resetQuestQuoteInCaseThereAErrorInTheCart,
  restoreCart,
  saveAddressInfoToCart,
  setGuestEmailOnCart,
  setPaymentMethod,
} from './actions';

import CartItemContainer from './cartItemContainer';
import CartPlaceOrder from './components/CartPlaceOrder';
import CheckoutHeader from './components/CheckoutHeader';
import CouponCodeBlock from './components/CouponCodeBlock';
import DanubeWallet from './components/DanubeWallet';
import OrderSummary from './components/OrderSummary';
import ShipToHeader from './components/ShipToHeader';
import {
  DELIVERY_CONTAINER,
  MY_CART_ORDER_SUMMARY,
  PAYMENT_METHOD_COMPONENT,
  PLACE_ORDER,
} from './constants';
import { DeliveryContainer } from './DeliveryContainer';
import PaymentInfo from './PaymentInfo';

let navigationDebounceTimer;

function CheckoutScreen({ navigation, route }) {
  const {
    type = '',
    mobile = '',
    lastName = '',
    firstName = '',
    email = '',
    selectedStore = {},
  } = route?.params || {};

  const isClickAndCollect = type === 'clickAndCollect';
  const { pwaGuestToken, userToken, country, language } = useSelector(
    (state) => state.auth
  );

  const [expandCoupanCode, setExpandCoupanCode] = useState(false);
  const { cartItems, paymentTypes, cartItemsLoading } = useSelector(
    (state) => state.cart
  );

  const { deliveryTypes = [] } = useSelector((state) => state.cart);

  const [selectedDeliveryType, setSelectedDeliveryType] = useState(
    deliveryTypes?.[0]
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(-1);
  const [selectedPaymentItem, setSelectedPaymentItem] = useState({});
  const [deliveryType, setDeliveryType] = useState(deliveryTypes);
  const [creditCardData, setCreditCardData] = useState({});
  const [tokenizationData, setPayfortTokenization] = useState({});
  const [guestShippingAddress, setGuestShippingAddress] = useState({});
  const [cardError, setCardError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const webviewRef = useRef(null);
  const dispatch = useDispatch();

  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [customerWalletData, setCustomerWalletData] = useState({});
  const [isApplyCouponSuccess, setIsApplyCouponSuccess] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [isPlaceOrderBtnLoaderVisible, setIsPlaceOrderBtnLoaderVisible] =
    useState(false);
  const [couponSuccessModalVisible, setSuccessCouponModalVisible] =
    useState(false);

  const defaultPayment = paymentTypes?.[0];

  const isFreeOfPayment = paymentTypes?.some((item) => item.code === 'free');

  //data from contentful
  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const checkoutData = screenSettings?.[SCREEN_NAME_CHECKOUT]?.components;
  const checkoutConfig = checkoutData?.[PAYMENT_METHOD_COMPONENT]?.config;
  const {
    payfortPurchaseReturnUrl = '',
    payfortTokenizationUrl = '',
    payfortTokenizationReturnUrl = '',
    payfortPurchaseUrl = '',
    payfortApplePayMerchantIdentifier = '',
    applePayMerchantIdentifier = '',
    payfortApplePayAccessCode = '',
    payfortApplePayRequestPhrase = '',
    payfortApplePayResponsePhrase = '',
  } = checkoutConfig;

  const orderSummaryLabels = myCartData?.[MY_CART_ORDER_SUMMARY]?.componentData;
  const checkoutIconsAndLabels =
    checkoutData?.[PAYMENT_METHOD_COMPONENT]?.componentData;
  const placeOrderLabels = checkoutData?.[PLACE_ORDER]?.componentData;
  const paymentIcons = checkoutIconsAndLabels?.icons;
  const footerIcons = checkoutIconsAndLabels?.acceptedCardIcons;

  const deliveryTypeInfo = myCartData?.[DELIVERY_CONTAINER]?.componentData;

  const { userProfile = {} } = useSelector((state) => state.auth);

  const addresses = userProfile?.customer?.addresses;

  const defaultAddress =
    addresses?.find((item) => {
      return item?.default_shipping === true;
    }) || {};

  const youSaved =
    Number(cartItems?.cartData?.subtotal) -
    Number(cartItems?.cartData?.subtotal_with_discount);

  const {
    city = '',
    postcode = '',
    firstname = '',
    lastname = '',
    country_id = '',
    telephone = '',
    latitude = '',
    longitude = '',
    flat_number = '',
    map_fields = '',
    street = [],
    region = {},
  } = defaultAddress;

  const isGuest = !userToken && pwaGuestToken;

  const [postPayInfo, setPostPayInfo] = useState({
    widgetType: 'payment-summary',
    locale: 'en',
    numInstalments: 3,
    merchantId: 'id_c56705f1a9304e8c8a16e1da98ec8734',
    amount: '00',
    currency: 'AED',
    widgetUrl: 'https://widgets-dev.postpay.io',
  });

  useEffect(() => {
    getCartPaymentDetails();
  }, [cartItems, guestShippingAddress]);

  useEffect(() => {
    if (defaultPayment?.code) {
      setSelectedPaymentMethod(0);
      setSelectedPaymentItem(defaultPayment);
      setPaymentMethod(userToken, pwaGuestToken, defaultPayment?.code);
    }
  }, [paymentTypes, pwaGuestToken]);

  const getGuestAddress = async () => {
    const receivedAddress = await AsyncStorage.getItem(
      'GUEST_SHIPPING_ADDRESS'
    );
    const parsedAddress = JSON.parse(receivedAddress);
    setGuestShippingAddress(parsedAddress);
  };

  useEffect(() => {
    if (isGuest) {
      AsyncStorage.getItem(DH_ONLINE_GUEST_EMAIL).then((email) => {
        if (email) {
          setGuestEmail(email);
        }
      });
    }
    //TODO: make sure this is updated email
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getGuestAddress();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    postPayUpdateValue('amount', cartItems?.cartData?.subtotal + '00');
  }, [cartItems]);

  const postPayUpdateValue = (type, value) => {
    setPostPayInfo((pre) => ({ ...pre, [type]: value }));
  };

  const getCartPaymentDetails = async () => {
    try {
      //TODO: check how click and collect comes here
      const addressData = {
        //pass the correct city name from the map
        city: isGuest ? guestShippingAddress?.city : city,
        // city: 'Dubai',
        //  country_id: 'AE',
        country_id: isGuest
          ? guestShippingAddress?.country_id?.toUpperCase()
          : country_id?.toUpperCase(),
        postcode: '000000',
        region: isGuest ? guestShippingAddress?.region?.region : region?.region,
      };

      const couponCode = await AsyncStorage.getItem('IS_COUPONCODE_APPLY');
      const isApplyCouponCode = JSON.parse(couponCode);
      if (isApplyCouponCode) {
        setExpandCoupanCode(true);
      }
      if (isApplyCouponCode) {
        setIsApplyCouponSuccess(isApplyCouponCode);
      }
      if (userToken) {
        const cartPaymentData = await getCartPayment();
        dispatch(setPaymentTypes(cartPaymentData?.getPaymentMethods));

        const shippingCost = await estimatedShippingCost(addressData);
        dispatch(setDeliveryTypes(shippingCost));
        setSelectedDeliveryType(shippingCost?.estimateShippingCosts?.[0]);
        const getcustomerWallet = await customerWallet(userToken);
        setCustomerWalletData(getcustomerWallet);
      } else {
        const cartPaymentData = await getCartPaymentWithParam(pwaGuestToken);
        dispatch(setPaymentTypes(cartPaymentData?.getPaymentMethods));
        //   setPaymentType(cartPaymentData?.getPaymentMethods);
        const guestShippingCost = await guestEstimatedShippingCost(
          addressData,
          pwaGuestToken
        );
        dispatch(setDeliveryTypes(guestShippingCost));
        setSelectedDeliveryType(guestShippingCost?.estimateShippingCosts?.[0]);
      }
      if (!firstLoaded) {
        Analytics_Events({
          eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
          params: { screen_name: SCREEN_NAME_CHECKOUT, country, language },
        });
      }
      setFirstLoaded(true);
    } catch (e) {
      logError(e);
      if (!firstLoaded) {
        Analytics_Events({
          eventName: EVENT_NAME_SCREEN_VIEW_ERROR,
          params: {
            screen_name: SCREEN_NAME_CHECKOUT,
            country,
            language,
            message: e.message,
          },
        });
      }
    }
  };
  const handleNewCardTokenization = async () => {
    try {
      if (creditCardData) {
        const { status: { number, expiry, cvc } = {} } = creditCardData;
        number.valid;

        if (number !== 'valid') {
          // todo show error
          setCardError('credit card error');
          return false;
        }
        if (expiry !== 'valid') {
          // todo show error
          setExpiryDateError('expiry date error');
          return false;
        }
        if (cvc !== 'valid') {
          // todo show error
          setCvvError('cvv error');
          return false;
        }
        // payfort credit card
        setIsPlaceOrderBtnLoaderVisible(true);
        // to do
        // Payfort authroize
        const tokenData = await getToken({
          ...creditCardData?.values,
          language,
          payfortTokenizationReturnUrl,
        });

        if (tokenData?.formData !== tokenizationData?.formData) {
          setPayfortTokenization(tokenData);
        }
      }
    } catch (e) {
      logError(e);
      showToast({
        type: 'error',
        message: (!__DEV__ && GENERIC_ERROR_MESSAGE(language)) || e.message,
      });
      setIsPlaceOrderBtnLoaderVisible(false);
    }
  };

  const getCustomerData = async () => {
    try {
      const { data, error } = await getCustomerCartData(dispatch);
      if (error) {
        dispatch(removeCartLoader());
      } else {
        dispatch(setUserCartItems(data));
      }
    } catch (e) {
      __DEV__ && showToast({ message: e.message, type: 'error' });
      logError(e);
    }
  };

  const handleApplePayErrorCallback = async (incrementId) => {
    try {
      const res = await restoreCart(incrementId);
      const { data } = res || {};
      if (res) {
        if (userToken) {
          await getCustomerData();
        } else {
          if (data && data.restoreQuote) {
            dispatch(setPWAGuestToken(data.restoreQuote));
          }
        }
      }
      setIsPlaceOrderBtnLoaderVisible(false);
    } catch (e) {
      logError(e);
    }
  };
  const handlePayfortTokenizationResponse = async (tokenData) => {
    let incrementIdForRestoringInCaseAnyError;
    try {
      const { incrementId, orderId, orderToken, error } =
        await handlePlaceOrder();
      incrementIdForRestoringInCaseAnyError = incrementId;
      if (incrementId) {
        let emailForPurchase = userProfile?.customer?.email;
        let customerNameForPurchase = `${defaultAddress.firstname || ''} ${
          defaultAddress.lastname || ''
        }`;
        if (!userToken) {
          emailForPurchase = await AsyncStorage.getItem(DH_ONLINE_GUEST_EMAIL);
          if (!emailForPurchase) {
            emailForPurchase = guestEmail;
          }
          customerNameForPurchase = `${guestShippingAddress.firstname || ''} ${
            guestShippingAddress.lastname || ''
          }`;
        }
        const purchaseResponse = await makePayfortPurchase({
          ...tokenData,
          orderNumber: incrementId,
          language,
          amount: cartItems?.cartData?.grand_total,
          currency: cartItems?.cartData?.base_currency_code,
          email: emailForPurchase,
          customerName: customerNameForPurchase,
          payfortPurchaseReturnUrl,
          payfortPurchaseUrl,
        });
        if (String(purchaseResponse.status) !== '20') {
          handleCheckoutPaymentFailure({
            index: selectedPaymentMethod,
            selectedItem: selectedPaymentItem,
            step: 'purchase',
            status: purchaseResponse.status,
            message: purchaseResponse.response_message,
          });
          showToast({
            message: purchaseResponse.response_message,
            type: 'error',
          });
          const res = await restoreCart(incrementId);
          const { data } = res || {};
          if (res) {
            if (userToken) {
              await getCustomerData();
            } else {
              if (data && data.restoreQuote) {
                dispatch(setPWAGuestToken(data.restoreQuote));
              }
            }
          }
          setIsPlaceOrderBtnLoaderVisible(false);
        } else {
          navigation.navigate('CreateSummary', {
            threeDSecureUrl: purchaseResponse['3ds_url'],
            paymentCode: selectedPaymentItem?.code,
            orderId,
            orderToken,
            cartItems,
            incrementId: incrementId,
          });
        }
        setIsPlaceOrderBtnLoaderVisible(false);
      } else if (error) {
        setIsPlaceOrderBtnLoaderVisible(false);
      }
    } catch (e) {
      if (incrementIdForRestoringInCaseAnyError) {
        const res = await restoreCart(incrementIdForRestoringInCaseAnyError);
      }
      logError(e);
      showToast({
        message: GENERIC_ERROR_MESSAGE(language, e.message),
        type: 'error',
      });
      handleCheckoutPaymentFailure({
        selectedItem: selectedPaymentItem,
        index: selectedPaymentMethod,
        step: 'tokenization',
        message: String(e.message),
        status: 'javascript error',
      });
    }
  };

  const handlePlaceOrder = async () => {
    const isGuest = !userToken && pwaGuestToken;

    setIsPlaceOrderBtnLoaderVisible(true);
    const normalAddress = {
      postcode,
      firstname,
      lastname,
      telephone,
      street,
      city,
      country_id,
      latitude,
      longitude,
      map_fields,
      flat_number,
    };

    const guestAddress = {
      postcode: guestShippingAddress?.postcode,
      firstname: guestShippingAddress?.firstname,
      lastname: guestShippingAddress?.lastname,
      telephone: guestShippingAddress?.telephone,
      street: [guestShippingAddress?.street],
      city: guestShippingAddress?.city,
      country_id: guestShippingAddress?.country_id,
      latitude: guestShippingAddress?.latitude,
      longitude: guestShippingAddress?.longitude,
      map_fields: guestShippingAddress?.map_fields,
      flat_number: guestShippingAddress?.flat_number,
    };

    const clickAndCollectAddress = {
      postcode: selectedStore?.postcode || '',
      firstname: firstName,
      lastname: lastName,
      telephone: mobile || '',
      street: [selectedStore?.city || ''],
      city: selectedStore?.city || '',
      country_id: selectedStore?.country_id || '',
      latitude: selectedStore?.latitude || '',
      longitude: selectedStore?.longitude || '',
      map_fields: selectedStore?.address || '',
      flat_number: selectedStore?.name || '',
    };

    const addressInfo = {
      addressInformation: {
        shipping_address: isClickAndCollect
          ? clickAndCollectAddress
          : isGuest
          ? guestAddress
          : normalAddress,
        billing_address: isClickAndCollect
          ? clickAndCollectAddress
          : isGuest
          ? guestAddress
          : normalAddress,
        shipping_carrier_code: selectedDeliveryType?.carrier_code || '',
        shipping_method_code: selectedDeliveryType?.method_code || '',
      },
    };
    let saveAddressRes;
    let saveAddressErr;
    try {
      if (pwaGuestToken && isGuest) {
        addressInfo.guestCartId = pwaGuestToken;
      }

      const res = await saveAddressInfoToCart(addressInfo);
      if (isGuest) {
        await setGuestEmailOnCart({
          cart_id: pwaGuestToken,
          email: guestEmail,
        });
      }
      saveAddressRes = res.saveAddressRes;
      saveAddressErr = res.saveAddressErr;
      if (!saveAddressRes) {
        setIsPlaceOrderBtnLoaderVisible(false);
        logError(res.saveAddressErr);
        showToast({
          type: 'error',
          message: GENERIC_ERROR_MESSAGE(language, saveAddressErr?.message),
        }); //TODO it should not show system messages
        return false;
      }
    } catch (e) {
      setIsPlaceOrderBtnLoaderVisible(false);
      showToast({
        type: 'error',
        message: GENERIC_ERROR_MESSAGE(language, e.message),
      });
      logError(e);
      return false;
    }

    if (saveAddressRes) {
      const addressData = {
        paymentInformation: {
          billing_address: isClickAndCollect
            ? clickAndCollectAddress
            : isGuest
            ? guestAddress
            : normalAddress,
          paymentMethod: {
            method:
              'payfort_fort_cc' ||
              selectedPaymentItem?.code ||
              'payfort_fort_cc',
          },
        },
        orderComments: 'test',
      };
      if (!userToken && pwaGuestToken) {
        addressData.guestCartId = pwaGuestToken;
      }

      if (isClickAndCollect) {
        addressData.pickupLocationId = selectedStore?.entity_id;
      }

      try {
        const { data, error } = await placeOrder(addressData);

        if (error) {
          showToast({
            message: GENERIC_ERROR_MESSAGE(language, error.message),
            type: 'error',
          });
          logError(error);
          setIsPlaceOrderBtnLoaderVisible(false);
          return { error: true };
        } else {
          const orderId =
            data?.data?.savePaymentInformationAndPlaceOrder?.increment_id;
          const orderToken =
            data?.data?.savePaymentInformationAndPlaceOrder?.order_token;
          const incrementId =
            data?.data?.savePaymentInformationAndPlaceOrder?.increment_id;
          if (data) {
            // setIsPlaceOrderBtnLoaderVisible(false);
            //  createEmptyCart();
            resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
            // Is it important to call empty cart to make sure user doesnt have active carts
            if (selectedPaymentMethod === 7) {
              let emailForPurchase = userProfile?.customer?.email;
              if (!userToken) {
                emailForPurchase = await AsyncStorage.getItem(
                  DH_ONLINE_GUEST_EMAIL
                );
                if (!emailForPurchase) {
                  emailForPurchase = guestEmail;
                }
              }
              return await makeApplePayRequest(
                {
                  incrementId,
                  merchant_identifier: payfortApplePayMerchantIdentifier, //'merchant.com.aldanube.dehome',
                  merchant_identifier_apple: applePayMerchantIdentifier, //'merchant.com.aldanube.dehome',
                  access_code: payfortApplePayAccessCode,
                  sha_type: 'SHA-256',
                  sha_request_phrase: payfortApplePayRequestPhrase,
                  sha_response_phrase: payfortApplePayResponsePhrase,
                  merchant_reference: String(incrementId), //'XYZ9239-yu898',
                  amount: String(cartItems?.cartData?.grand_total * 100),
                  currencyType: cartItems?.cartData?.base_currency_code,
                  countryCode: country,
                  language,
                  email: emailForPurchase,
                  // testing: true,
                  order_description: '',
                  items: cartItems?.cartData?.items,
                },
                {
                  successCallback: async () => {
                    const res = await getOrderConfirmationDetails(
                      orderToken,
                      dispatch
                    );
                    if (res) {
                      navigation.navigate('Thanks', {
                        orderToken,
                        orderId,
                        incrementId,
                      });
                      ReactNativeHapticFeedback.trigger('notificationSuccess');
                    }
                  },
                  errorCallback: handleApplePayErrorCallback,
                }
              );
            } else if (selectedPaymentItem?.code === 'payfort_fort_cc') {
              return { incrementId, orderId, orderToken };
            } else if (selectedPaymentItem?.code === 'cashondelivery') {
              const res = await getOrderConfirmationDetails(
                orderToken,
                dispatch
              );
              setIsPlaceOrderBtnLoaderVisible(false);
              navigation.navigate('Thanks', {
                orderToken,
                orderId,
                incrementId,
              });
            } else {
              setIsPlaceOrderBtnLoaderVisible(false);
              navigation.navigate('CreateSummary', {
                orderId,
                orderToken,
                paymentCode: selectedPaymentItem?.code,
                cartItems,
                incrementId: incrementId,
                shipping_city: isClickAndCollect ? selectedStore.city : city,
                shipping_line1: isClickAndCollect
                  ? selectedStore?.address
                  : map_fields,
              });
            }
          } else {
            setIsPlaceOrderBtnLoaderVisible(false);
          }
        }
      } catch (error) {
        setIsPlaceOrderBtnLoaderVisible(false);
        showToast({
          message: GENERIC_ERROR_MESSAGE(language, error.message),
          type: 'error',
        });
        logError(error);
        return { error };
      }
    } else {
      setIsPlaceOrderBtnLoaderVisible(false);
    }
  };
  const handleCreditCardOnChange = (data) => {
    setCardError('');
    setCvvError('');
    setExpiryDateError('');
    setCreditCardData(data);
  };
  const handleSelectPaymentMethod = ({ index, selectedItem }) => {
    try {
      Analytics_Events({
        eventName: EVENT_NAME_CHECKOUT_OPTION_SELECTED,
        params: {
          index,
          method: selectedItem?.code,
          country,
          language,
        },
      });
    } catch (e) {
      logError(e);
    }
  };
  const handlePlaceOrderButtonClick = () => {
    try {
      Analytics_Events({
        eventName: EVENT_NAME_CUSTOM_CLICK,
        params: {
          method: selectedPaymentItem?.code,
          country,
          language,
        },
      });
    } catch (e) {
      logError(e);
    }
  };
  const handleCheckoutPaymentFailure = ({
    index,
    selectedItem,
    step,
    message,
    status,
  }) => {
    try {
      Analytics_Events({
        eventName: EVENT_NAME_CHECKOUT_PAYMENT_FAILURE,
        params: {
          index,
          method: selectedItem?.code,
          country,
          language,
          step,
          message,
          status,
        },
      });
    } catch (e) {
      logError(e);
    }
  };

  const onToggleWallet = async () => {
    const credit_not_applied =
      cartItems?.cartData?.applied_store_credit?.applied_balance?.value === 0;
    dispatch(addCartLoader());
    const { data, error } = credit_not_applied
      ? await applyStoreCredit()
      : await removeStoreCredit();
    if (error) {
      dispatch(removeCartLoader());
    }
    if (data) {
      getCustomerData();
    }
  };

  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      EventToken: 'tpm40f',
      params: {
        screen_name: SCREEN_NAME_CHECKOUT,
        country,
        language,
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <CheckoutHeader
        mainIcon={<DanubeLogo />}
        navigation={navigation}
        backIcon={<BackArrow />}
      />

      <Spinner
        visible={isPlaceOrderBtnLoaderVisible}
        textContent="Hold On..."
        overlayColor="rgba(0, 0, 0, 0.90)"
        textStyle={{ color: colors.light_grey }}
      />
      {/**TODO Test from contentful */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <Block margin={[0, 0, 19, 0]}>
            <DeliveryContainer
              labelsAndIcons={deliveryTypeInfo}
              typeDataArr={deliveryType}
              onSelectDeliveryType={(typeData) => {
                setSelectedDeliveryType(typeData);
                if (typeData?.carrier_code === 'tablerate') {
                  navigation.navigate('Checkout');
                } else {
                  navigation.navigate('ClickAndCollect');
                }
              }}
              selectedDeliveryType={selectedDeliveryType}
            />
          </Block>

          {isClickAndCollect ? (
            <>
              <ShipToHeader
                extraStyle={{
                  marginHorizontal: 14,
                  backgroundColor: colors.grey_10,
                  marginTop: null,
                }}
                button
                buttonLabel={'Change'}
                label={'Collection Store'}
                onPress={() => navigation.navigate('ClickAndCollect')}
              />
              <View style={{ marginHorizontal: 21 }}>
                <DanubeText
                  mediumText
                  variant={TextVariants.S}
                  color={colors.black_3}
                >
                  {selectedStore?.name || ''}
                </DanubeText>
                <DanubeText style={{ fontSize: 13, marginVertical: 10 }}>
                  {selectedStore?.address || ''}
                </DanubeText>
                <DanubeText style={{ fontSize: 13, marginBottom: 25 }}>
                  Collect in store from 1 - 2 days {/**TODO translation */}
                </DanubeText>
              </View>
            </>
          ) : null}

          {isClickAndCollect ? (
            <>
              <ShipToHeader
                extraStyle={{
                  marginHorizontal: 14,
                  backgroundColor: colors.grey_10,
                }}
                button
                buttonLabel={'Change'}
                label={'Receiver Information'}
                onPress={() => navigation.navigate('ClickAndCollect')}
              />
              <AddressBody
                isClickAndCollect={true}
                defaultAddressSelected={null}
                name={`${firstName || ''} ${lastName || ''}`}
                address={email || ''}
                mobileNo={mobile || ''}
                flatNumber={flat_number}
                extraStyle={{ marginHorizontal: 14, borderBottomWidth: null }}
              />
              <Seperator bold />
            </>
          ) : null}

          {defaultAddress && !isClickAndCollect ? (
            <View
              style={{ paddingBottom: 6.5, backgroundColor: colors.grey_10 }}
            >
              <View style={{ backgroundColor: colors.white }}>
                <ShipToHeader
                  extraStyle={{
                    marginHorizontal: 14,
                    backgroundColor: colors.grey_10,
                  }}
                  button
                  buttonLabel={userToken ? 'Change' : 'Edit'}
                  label={'Ship To'}
                  onPress={() =>
                    userToken
                      ? navigation.navigate('AddressListing', {
                          itemId: defaultAddress?.id,
                        })
                      : navigation.navigate('AddressInput', {
                          guestUser: true,
                        })
                  }
                />
                <AddressBody
                  flatNumber={
                    userToken
                      ? defaultAddress?.flat_number
                      : guestShippingAddress?.flat_number
                  }
                  underline={false}
                  defaultAddressSelected={null}
                  name={
                    userToken
                      ? `${defaultAddress?.firstname || ''} ${
                          defaultAddress?.lastname || ''
                        }`
                      : `${guestShippingAddress?.firstname || ''} ${
                          guestShippingAddress?.lastname || ''
                        }`
                  }
                  address={
                    userToken
                      ? defaultAddress?.map_fields
                      : guestShippingAddress?.map_fields
                  }
                  mobileNo={
                    userToken
                      ? defaultAddress?.telephone
                      : guestShippingAddress?.telephone
                  }
                  extraStyle={{ marginHorizontal: 14, borderBottomWidth: null }}
                />
              </View>
            </View>
          ) : null}

          <CouponCodeBlock
            showModal={() => {
              setSuccessCouponModalVisible(true);
              setTimeout(() => {
                setSuccessCouponModalVisible(false);
                // eslint-disable-next-line no-magic-numbers
              }, 4000);
            }}
            couponApplied={cartItems?.cartData?.coupon_code}
            discountAmount={cartItems?.cartData?.discount_amount || ''}
            currency={cartItems?.cartData?.base_currency_code || ''}
          />

          {/* wallet design */}
          {userToken &&
          cartItems?.cartData?.applied_store_credit?.current_balance?.value >
            0 ? (
            <DanubeWallet
              walletData={cartItems?.cartData?.applied_store_credit}
              extraStyle={{ paddingHorizontal: 14 }}
              onPress={onToggleWallet}
              walletLoading={cartItemsLoading}
            />
          ) : null}

          {/* Payment Info */}
          <View
            style={{ paddingVertical: 6.5, backgroundColor: colors.grey_10 }}
          >
            <View style={{ backgroundColor: colors.white }}>
              {isFreeOfPayment ? (
                <DanubeText
                  center
                  style={styles.noPayment}
                  variant={TextVariants.XS}
                  color={colors.black}
                >
                  No Payment Information Required {/**TODO translation */}
                </DanubeText>
              ) : (
                <View>
                  <Block
                    flex={false}
                    margin={[25, 15, 0, 15]}
                    color={colors.white}
                  >
                    <DanubeText
                      variant={TextVariants.S}
                      color={colors.black_3}
                      mediumText
                      style={styles.marginBottom}
                    >
                      Select payment method {/**TODO translation */}
                    </DanubeText>
                    {paymentTypes?.length > 0 ? (
                      <Block flex={false}>
                        {paymentTypes?.map((item, index) => {
                          return (
                            <PaymentInfo
                              cardError={cardError}
                              cvvError={cvvError}
                              expiryDateError={expiryDateError}
                              key={item?.code + index}
                              paymentIcons={paymentIcons}
                              item={item}
                              index={index}
                              selectedPaymentMethod={selectedPaymentMethod}
                              selectedPaymentItem={selectedPaymentItem}
                              productInfo={postPayInfo}
                              selectOtherPaymentMethod={(
                                index,
                                selectedItem
                              ) => {
                                setSelectedPaymentMethod(index);
                                setSelectedPaymentItem(selectedItem);
                                setPaymentMethod(
                                  userToken,
                                  pwaGuestToken,
                                  selectedItem?.code
                                );
                                handleSelectPaymentMethod({
                                  selectedItem,
                                  index,
                                });
                              }}
                              handleCreditCardOnChange={
                                handleCreditCardOnChange
                              }
                            />
                          );
                        })}

                        {Platform.OS === 'ios' && (
                          <PaymentInfo //APPle pay test
                            paymentIcons={paymentIcons}
                            item={{ code: 'APPLE_PAY', title: 'Apple Pay' }}
                            index={7}
                            selectedPaymentMethod={selectedPaymentMethod}
                            selectedPaymentItem={selectedPaymentItem}
                            productInfo={postPayInfo}
                            selectOtherPaymentMethod={(index, selectedItem) => {
                              setSelectedPaymentMethod(7);
                              setSelectedPaymentItem(selectedItem);
                              setPaymentMethod(
                                userToken,
                                pwaGuestToken,
                                selectedItem?.code
                              );
                              handleSelectPaymentMethod({
                                selectedItem,
                                index,
                              });
                            }}
                            handleCreditCardOnChange={handleCreditCardOnChange}
                          />
                        )}

                        {tokenizationData?.formData ? (
                          <WebView
                            ref={webviewRef}
                            style={{ height: 0, width: 0 }}
                            animating
                            startInLoadingState
                            onNavigationStateChange={(navState, event) => {
                              clearTimeout(navigationDebounceTimer);
                              navigationDebounceTimer = setTimeout(() => {
                                logInfo('navState payfort', navState, event);
                                if (
                                  navState.url.indexOf(
                                    '/payfort/tokenization/success'
                                  ) > -1
                                ) {
                                  let urlObj = new URL(navState.url);

                                  logInfo(
                                    'Payfort Status',
                                    urlObj.searchParams.get('status')
                                  );
                                  if (
                                    urlObj.searchParams.get('status') !== '18'
                                  ) {
                                    setIsPlaceOrderBtnLoaderVisible(false);
                                    showToast({
                                      type: 'error',
                                      message: String(
                                        urlObj.searchParams.get('message') ||
                                          GENERIC_ERROR_MESSAGE(language)
                                      ),
                                    });
                                    try {
                                      handleCheckoutPaymentFailure({
                                        selectedItem: selectedPaymentItem,
                                        index: selectedPaymentMethod,
                                        step: 'tokenization',
                                        message: String(
                                          urlObj.searchParams.get('message')
                                        ),
                                        status:
                                          urlObj.searchParams.get('status'),
                                      });
                                    } catch (e) {
                                      logError(e);
                                    }
                                    return;
                                  }
                                  handlePayfortTokenizationResponse({
                                    status: urlObj.searchParams.get('status'),
                                    message:
                                      urlObj.searchParams.get(
                                        'response_message'
                                      ),
                                    tokenName:
                                      urlObj.searchParams.get('token_name'),
                                  });
                                }
                                // eslint-disable-next-line no-magic-numbers
                              }, 500);
                            }}
                            source={{
                              uri: payfortTokenizationUrl, // TODO , make it configurable
                              method: 'POST',
                              body: tokenizationData.formData,
                              headers: {
                                'Content-Type':
                                  'application/x-www-form-urlencoded',
                              },
                            }}
                          />
                        ) : null}
                      </Block>
                    ) : null}
                    <DanubeText
                      variant={TextVariants.XXXS}
                      style={styles.weAccept}
                    >
                      We Accept
                    </DanubeText>
                    <View style={styles.paymentFooter}>
                      {footerIcons?.map((item) => {
                        return (
                          <View key={item?.id} style={styles.footerIcon}>
                            <SvgUri uri={item?.icon} />
                          </View>
                        );
                      })}
                    </View>
                  </Block>
                </View>
              )}
            </View>
          </View>
          <View style={{ backgroundColor: colors.grey_10, paddingTop: 6.5 }}>
            <Block flex={false} padding={[21, 16, 0, 16]} color={colors.white}>
              <DanubeText variant={TextVariants.XXS} mediumText>
                Your Order Summary
              </DanubeText>
              <Block
                flex={false}
                width={'100%'}
                selfcenter
                margin={[11, 0, 21, 0]}
              >
                {cartItems?.cartData?.items.map((item, index) => {
                  return (
                    <CartItemContainer
                      key={item?.sku}
                      item={item}
                      index={index}
                      productData={cartItems}
                      isDeleteAndHeartIconVisible={false}
                    />
                  );
                })}
              </Block>
            </Block>
          </View>
          <OrderSummary
            isCashonDelivery={selectedPaymentItem?.code === 'cashondelivery'}
            isCheckout={true}
            orderSummaryLabels={orderSummaryLabels}
            SubTotalAmount={`${
              cartItems?.cartData?.base_currency_code || ' '
            } ${cartItems?.cartData?.subtotal}`}
            cartData={cartItems?.cartData}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.shadow,
          Platform.OS === 'ios' ? { backgroundColor: colors.white } : {},
        ]}
      >
        <CartPlaceOrder
          youSaved={youSaved}
          header={placeOrderLabels?.header || ''}
          subLabel={placeOrderLabels?.subLabel || ''}
          currencyCode={`${cartItems?.cartData?.base_currency_code || ''}`}
          subTotal={`${cartItems?.cartData?.subtotal}`}
          subTotalWithDiscount={`${cartItems?.cartData?.grand_total}`}
        />

        {/* Proceed to checkout button */}
        {selectedPaymentMethod === 7 ? (
          <View style={{ margin: 10 }}>
            <ApplePayButton
              buttonStyle="black"
              type="purchase"
              cornerRadius={4} // Default value is 4.0
              width={'100%'}
              height={45}
              disabled={isPlaceOrderBtnLoaderVisible}
              onPress={() => {
                handlePlaceOrderButtonClick({
                  selectedPaymentItem,
                });

                handlePlaceOrder();
              }}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.proceedToCheckoutButtonView}
            onPress={() => {
              handlePlaceOrderButtonClick({
                selectedPaymentItem,
              });
              if (selectedPaymentItem?.code === 'payfort_fort_cc') {
                handleNewCardTokenization();
              } else {
                handlePlaceOrder();
              }
            }}
            disabled={isPlaceOrderBtnLoaderVisible}
          >
            {!isPlaceOrderBtnLoaderVisible && (
              <DanubeText
                color={colors.white}
                variant={TextVariants.S}
                mediumText
              >
                {placeOrderLabels?.buttonLabel || ''}
              </DanubeText>
            )}
            {isPlaceOrderBtnLoaderVisible && (
              <ActivityIndicator color={'white'} size={'small'} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <CouponSuccessModal
        visible={couponSuccessModalVisible}
        discountAmount={cartItems?.cartData?.discount_amount}
        currency={cartItems?.cartData?.base_currency_code}
      />
    </SafeAreaView>
  );
}
export default CheckoutScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loginOrRegisterButtonView: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    alignSelf: 'center',
    padding: 20,
    marginTop: 15,
  },
  loginText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
  },
  forExampleText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#333333',
    marginTop: 10,
  },
  chargesStyle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  otherChargesView: {
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    marginTop: 20,
  },
  inclusiveText: {
    fontSize: 10,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#909090',
    textAlign: 'right',
  },
  desView: {
    borderWidth: 1,
    borderColor: '#fbe9bf',
    borderRadius: 5,
    marginTop: 10,
  },
  or3InterestText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#3d3d3d',
  },
  postpayText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#8ABBD5',
  },
  learnMoreButtonView: {
    borderWidth: 1,
    borderColor: '#fbe9bf',
    borderRadius: 5,
    marginTop: 10,
  },
  orAEDText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#3d3d3d',
  },
  learnMoreText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textDecorationLine: 'underline',
  },
  continueButtonView: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: 'red',
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  proceedToCheckoutButtonView: {
    width: '90%',
    padding: 15,
    backgroundColor: colors.light_green,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  proceedToChekoutText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  yourOrderText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  selectPaymentInfo: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  markerViewStyle: { height: 200, width: 200 },
  waitMinsMainView: { height: 55, width: 45 },
  seachBarView: {
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? 5 : 5,
    width: 300,
  },
  googlePlaceAutoCompleteStyle: {
    textInputContainer: {
      width: '100%',
    },
    textInput: {
      top: 2,
      height: 40,
      color: '#5d5d5d',
      fontSize: 16,
      marginHorizontal: 5,
    },
    predefinedPlacesDescription: {
      color: 'red',
    },
    listView: {
      width: 250,
    },
    poweredContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  container: {
    flex: 1,
  },
  danubeWalletText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#454545',
  },
  availableAmountText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#3a9c0a',
    marginLeft: 15,
    marginBottom: 5,
  },
  marginBottom: {
    marginBottom: 12,
  },
  paymentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
    marginTop: 6,
  },
  footerIcon: {
    marginHorizontal: 2.5,
  },
  weAccept: {
    marginTop: 12,
    alignSelf: 'center',
  },
  noPayment: {
    paddingVertical: 12,
  },
  shadow: {
    elevation: 1.6,
    shadowColor: '#00000066',
    borderWidth: 0.01,
    borderColor: '#00000066',
    shadowOffset: { height: -4 },
    shadowOpacity: 0.2,
  },
});
