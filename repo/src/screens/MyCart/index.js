import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ApolloClientMagento from '../../ApolloClientMagento';
import Block from '../../components/Block';
import CouponSuccessModal from '../../components/CouponSuccessModal';
import { Loader } from '../../components/Loder';
import Text from '../../components/Text';
import {
  DEFAULT_BRAND,
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  FONT_FAMILY_ENGLISH_REGULAR,
  SCREEN_NAME_MY_CART,
} from '../../constants';
import { cartViewLogEvent } from '../../helper/cart';
import { Analytics_Events } from '../../helper/Global';
import { VIEW_CART_CUSTOMER, VIEW_CART_GUEST } from '../../helper/gql/query';
import {
  removeCartLoader,
  setUserCartItems,
} from '../../slicers/checkout/checkoutSlice';
import colors from '../../styles/colors';
import EmptyScreen from '../EmptyScreen';
import LoginRegisterScreen from '../LoginRegister/LoginRegisterScreen';
import CartItemContainer from './cartItemContainer';
import BuyNowPayLater from './components/BuyNowPayLater';
import CartHeader from './components/CartHeader';
import CartPlaceOrder from './components/CartPlaceOrder';
import CouponCodeBlock from './components/CouponCodeBlock';
import FreeShippingMessage from './components/FreeShippingMessage';
import OrderSummary from './components/OrderSummary';
import {
  FREE_SHIPPING_MESSAGE,
  MY_CART_CHECKOUT,
  MY_CART_EMPTY_SCREEN,
  MY_CART_HEADER,
  MY_CART_ORDER_SUMMARY,
  MY_CART_PRODUCT_CARD,
} from './constants';
import { CrossSellWidgets } from './CrossSellWidgets';

function MyCartScreen({ navigation }) {
  const { pwaGuestToken, userToken, userProfile, country, language } =
    useSelector((state) => state.auth);
  const { deliveryTypes = [] } = useSelector((state) => state.cart);

  const clickAndCollectExist = deliveryTypes?.some(
    (item) => item?.carrier_code === 'mageworxpickup'
  );

  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const cartItemsLoading = useSelector((state) => state.cart.cartItemsLoading);
  const noOfItems = cartItems?.cartData?.items?.length;
  const addressExist = userProfile?.customer?.addresses?.length;
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [couponSuccessModalVisible, setSuccessCouponModalVisible] =
    useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userToken) {
      getCustomerData();
    } else {
      getCartData();
    }
  }, [userToken, pwaGuestToken]);
  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      EventToken: 'tpm40f',
      params: {
        screen_name: SCREEN_NAME_MY_CART,
        country,
        language,
      },
    });
  }, []);

  const getCustomerData = async () => {
    const { data } = await getCartForCustomerData();
    dispatch(setUserCartItems(data));
  };

  const [getCartForCustomerData] = useLazyQuery(VIEW_CART_CUSTOMER, {
    client: ApolloClientMagento,
    fetchPolicy: 'no-cache',
  });

  const [getCart] = useLazyQuery(VIEW_CART_GUEST);
  const getCartData = async () => {
    const { data, error } = await getCart({
      variables: {
        cart_id: `${pwaGuestToken}`,
      },
    });
    if (error) {
      dispatch(removeCartLoader(false));
    }
    dispatch(setUserCartItems(data));
  };

  const onCheckOutLogEvent = () => {
    let customData = {};
    let productItemArr = [];

    cartItems?.cartData?.items?.map((el) => {
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.product?.categories?.map((dataObj, index) => {
        if (index === 0) {
          categoriesLevel2 = dataObj?.name;
        } else if (index === 1) {
          categoriesLevel3 = dataObj?.name;
        } else if (index === 2) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      productItemArr.push({
        item_brand: DEFAULT_BRAND, //TODO FIND BRAND
        item_category: categoriesLevel2,
        item_category2: categoriesLevel3,
        item_category3: categoriesLevel4,
        item_id: el?.product?.sku,
        item_list_id: '', //rowData?.rowName
        item_list_name: '', //rowData?.rowName
        item_name: el?.product?.name,
        //  item_location_id: `slot${0}_${0}`, //row_index  , productIndex
        price: parseFloat(el?.price),
      });
    });

    customData = {
      coupon: '',
      currency: cartItems?.cartData?.base_currency_code,
      items: productItemArr,
      value: cartItems?.cartData?.grand_total,
    };

    Analytics_Events({
      eventName: 'Check_Out',
      params: customData,
    });
  };
  const [viewCartEventFired, setViewCartEventFired] = useState(false);
  useEffect(() => {
    if (!viewCartEventFired && !cartItemsLoading) {
      cartViewLogEvent({
        cartItems: cartItems,

        currency: cartItems?.cartData?.base_currency_code,
      });
      setViewCartEventFired(true);
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,

        params: {
          screen_name: SCREEN_NAME_MY_CART,
          country,
          language,
        },
      });
    }
  }, [cartItems?.cartData?.items, cartItemsLoading]);

  const toggleLoginModal = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  const onCheckout = ({ newToken } = {}) => {
    onCheckOutLogEvent();
    newToken || userToken
      ? addressExist
        ? navigation.navigate('Checkout', { deliveryTypes })
        : clickAndCollectExist
        ? navigation.navigate('ChooseDeliveryType', { deliveryTypes })
        : navigation.navigate('AddressInput')
      : setIsLoginModalVisible(true);
  };

  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const headerData = myCartData?.[MY_CART_HEADER]?.componentData;
  const productCardLabels = myCartData?.[MY_CART_PRODUCT_CARD]?.componentData;
  const emptyScreenLabels = myCartData?.[MY_CART_EMPTY_SCREEN]?.componentData;
  const checkoutBlockLabels = myCartData?.[MY_CART_CHECKOUT]?.componentData;
  const orderSummaryLabels = myCartData?.[MY_CART_ORDER_SUMMARY]?.componentData;
  const freeShippingInfo = myCartData?.[FREE_SHIPPING_MESSAGE]?.componentData;

  const notEmpty = !!cartItems?.cartData?.items?.length;

  const youSaved =
    Number(cartItems?.cartData?.subtotal) -
    Number(cartItems?.cartData?.subtotal_with_discount);

  const freeShippingAmount =
    Number(freeShippingInfo?.freeShippingCutOff) -
    Number(cartItems?.cartData?.subtotal_with_discount);

  // if there is cart items it will show the page
  // if it is undefined show loader
  // if I get empty array show it is empty
  // check and verify items will return empty array always if there is no products
  // loader will be initially false
  // when api gets called change to true
  // when data gets again false
  // so if cart items null || data loading true, show the loader.
  // otherwise empty screen or the items list

  return (
    <SafeAreaView style={styles.safearea}>
      {cartItemsLoading ? (
        <Loader />
      ) : (
        <>
          {notEmpty ? (
            <>
              <CartHeader
                navigation={navigation}
                label={headerData?.label}
                noOfItems={noOfItems}
                fromCart={true}
              />
              <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <ScrollView bounces={false}>
                  {freeShippingAmount > 0 ? (
                    <FreeShippingMessage
                      amount={freeShippingAmount}
                      description={freeShippingInfo?.description || ''}
                      currencyType={cartItems?.cartData?.base_currency_code}
                    />
                  ) : (
                    <FreeShippingMessage
                      extraStyle={styles.shippingMessage}
                      freeShipping={true}
                      description={freeShippingInfo?.successMessage}
                    />
                  )}

                  <Block style={styles.productBlock}>
                    {cartItems?.cartData?.items?.map((item, index) => {
                      return (
                        <CartItemContainer
                          key={item?.sku + index}
                          productCardLabels={productCardLabels}
                          item={item}
                          index={index}
                          productData={cartItems}
                          loginOnWishList={() => {
                            setIsLoginModalVisible(true);
                          }}
                        />
                      );
                    })}
                  </Block>

                  <CrossSellWidgets />
                  <OrderSummary
                    isFromCart={true}
                    orderSummaryLabels={orderSummaryLabels}
                    SubTotalAmount={`${
                      cartItems?.cartData?.base_currency_code || ''
                    } ${cartItems?.cartData?.subtotal || '0'}`}
                    cartData={cartItems?.cartData}
                  />

                  <CouponCodeBlock
                    showModal={() => {
                      setSuccessCouponModalVisible(true);
                      setTimeout(() => {
                        setSuccessCouponModalVisible(false);
                        // eslint-disable-next-line no-magic-numbers
                      }, 5000);
                    }}
                    couponApplied={cartItems?.cartData?.coupon_code}
                    discountAmount={cartItems?.cartData?.discount_amount || ''}
                    currency={cartItems?.cartData?.base_currency_code || ''}
                  />

                  <BuyNowPayLater />
                </ScrollView>
              </KeyboardAvoidingView>
              <View
                style={[
                  styles.shadow,
                  Platform.OS === 'ios'
                    ? { backgroundColor: colors.white }
                    : {},
                ]}
              >
                <CartPlaceOrder
                  header={checkoutBlockLabels?.header}
                  subLabel={checkoutBlockLabels?.subLabel}
                  currencyCode={`${
                    cartItems?.cartData?.base_currency_code || ''
                  }`}
                  subTotal={`${cartItems?.cartData?.subtotal}`}
                  subTotalWithDiscount={`${cartItems?.cartData?.grand_total}`}
                  youSaved={youSaved || ''}
                />
                <TouchableOpacity
                  style={styles.proceedToCheckoutButtonView}
                  onPress={onCheckout}
                >
                  <Text style={styles.proceedToChekoutText}>
                    {checkoutBlockLabels?.buttonLabel}
                  </Text>
                </TouchableOpacity>
              </View>
              <CouponSuccessModal
                visible={couponSuccessModalVisible}
                discountAmount={cartItems?.cartData?.discount_amount || ''}
                currency={cartItems?.cartData?.base_currency_code || ''}
              />
            </>
          ) : (
            <EmptyScreen
              navigation={navigation}
              headerComponent={
                <CartHeader
                  isEmptyCartHeader={true}
                  label={emptyScreenLabels?.header_label}
                  fromCart={true}
                />
              }
              buttonLabel={emptyScreenLabels?.button_label}
              title={emptyScreenLabels?.title}
              description={emptyScreenLabels?.description}
              icon={emptyScreenLabels?.icon}
            />
          )}
          {isLoginModalVisible ? (
            <LoginRegisterScreen
              noAutoFocusSignInInput={true}
              isVisible={isLoginModalVisible}
              toggleSigninModal={toggleLoginModal}
              isFromProceedToCheckout={true}
              navigation={navigation}
              afterSignIn={({ token }) => {
                // TODO ti should automaticall navigate to next screen
                setTimeout(() => onCheckout({ token }), 100);
              }}
            />
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
}
export default MyCartScreen;

const styles = StyleSheet.create({
  loginOrRegisterButtonView: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    alignSelf: 'center',
    padding: 20,
    marginTop: 15,
  },
  productBlock: {
    marginHorizontal: 14,
    marginTop: 19,
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
    backgroundColor: colors.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 13,
    minHeight: 52,
  },
  proceedToChekoutText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  safearea: {
    flex: 1,
    backgroundColor: 'white',
  },
  shippingMessage: {
    backgroundColor: colors.green,
    borderColor: colors.green_2,
  },
  flex: {
    flex: 1,
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
