import React, { useEffect, useMemo, useRef, useState } from 'react';
import isEmpty from 'lodash.isempty';

import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';

import LogoCallBackSearchHeader from '../../components/LogoCallBackSearchHeader';
import BannerCarousel from '../../components/BannerCarousel';

import { ImageScroller } from '../../components/ImageCarousel';
import { ProductCarousel } from '../../components/ProductCarousel';
import { ImageGridContainer } from '../../components/ImageGrid';
import Block from '../../components/Block';
import { colors } from '../../constants/theme';
import { Login } from '../authentication';
import { Loader } from '../../components/Loder';
import { useDispatch, useSelector } from 'react-redux';

import { VIEW_CART_CUSTOMER, VIEW_CART_GUEST } from '../../helper/gql/query';
import { getCountryData } from '../../helper/country';
import { Analytics_Events, logError } from '../../helper/Global';
import {
  setCurrentViewableRowsIndexes,
  setProductImpressions,
  setPromotionsImpressionsIdArr,
} from '../../slicers/analytic/analyticSlice';
import {
  DH_ONLINE_PWA_GUEST_TOKEN,
  DH_ONLINE_USER_TOKEN,
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  SCREEN_NAME_HOME,
  SCREEN_NAME_SPLASH,
  STATUS_BAR_COLOR_BLACK,
} from '../../constants';
import {
  removeCartLoader,
  setDeliveryTypes,
  setPaymentTypes,
  setUserCartItems,
} from '../../slicers/checkout/checkoutSlice';

import { useLazyQuery } from '@apollo/client';
import { getHomePage } from './actions';
import { getCustomerProfile } from '../authentication/actions';
import ApolloClientMagento from '../../ApolloClientMagento';
import {
  estimatedShippingCost,
  getCartPayment,
  getCartPaymentWithParam,
  guestEstimatedShippingCost,
  resetQuestQuoteInCaseThereAErrorInTheCart,
} from '../MyCart/actions';
import { getWishlist } from '../WishList/actions';
import HomeScreenShimmer from '../../components/Shimmer/HomeScreenShimmer';
import OneSignal from 'react-native-onesignal';
import useDynamicURL from '../../hooks/useDynamicURL';
import usePushNotification from '../../hooks/usePushNotification';
import { createEmptyCart } from '../InvisibleScreen/actions';
import BackArrow from '../../../assets/svg/BackArrow.svg';
import { setPWAGuestToken } from '../../slicers/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleDeeplink } from '../../helper/handleDeeplink';
import { env } from '../../src/config/env';

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const { width } = Dimensions.get('window');
const scrollerImageWidth = Math.ceil(width) + 20;

function HomeScreen({ navigation, route = {} }) {
  const { params = {} } = route;
  const {
    landed_from_url,
    via,
    landed_from_push_notification,
    is_deferred_deeplink = false,
    pageId,
  } = params;
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [quickActionsAdded, setQuickActionsAdded] = useState(false);

  const { language, country, userToken, pwaGuestToken } = useSelector(
    (state) => state.auth
  );
  const cart = useSelector((state) => state.cart?.cartItems);
  const { screenSettings } = useSelector((state) => state.screens);
  const { promotionsImpressionsIdArr, currentViewableRowsIndexes } =
    useSelector((state) => state.analytic);
  const countryData = getCountryData({ country });
  const dispatch = useDispatch();
  const [productIdArr, setProductIdArr] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [
    getCart,
    { loading: guestCartLoading, error: guestCartError, data: guestCartData },
  ] = useLazyQuery(VIEW_CART_GUEST);

  const [getCartForCustomerData] = useLazyQuery(VIEW_CART_CUSTOMER, {
    client: ApolloClientMagento,
    fetchPolicy: 'no-cache',
  });

  useDynamicURL();
  usePushNotification();

  const checkIsTokenAvailable = async () => {
    const currentUserToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
    if (!currentUserToken) {
      const currentPwaGuestToken = await AsyncStorage.getItem(
        DH_ONLINE_PWA_GUEST_TOKEN
      );
      dispatch(setPWAGuestToken(currentPwaGuestToken));
      if (currentPwaGuestToken) {
      } else {
        const viewCartForCustomer = await createEmptyCart();
        await AsyncStorage.setItem(
          DH_ONLINE_PWA_GUEST_TOKEN,
          viewCartForCustomer?.createEmptyCart
        );
        dispatch(setPWAGuestToken(viewCartForCustomer?.createEmptyCart));
      }
    }
  };
  useEffect(() => {
    checkIsTokenAvailable();
  }, []);

  const getDeliveryType = async () => {
    //this is to get the delivery types
    const addressData = {
      city: '', // empty only initial call
      country_id: 'AE',
      postcode: '000000',
      region: '', // not needed in initial call
    };
    if (userToken) {
      const deliveryTypes = await estimatedShippingCost(addressData);
      dispatch(setDeliveryTypes(deliveryTypes));
    } else {
      const deliveryTypes = await guestEstimatedShippingCost(
        addressData,
        pwaGuestToken
      );
      dispatch(setDeliveryTypes(deliveryTypes));
    }
  };

  const getPaymentTypes = async () => {
    if (userToken) {
      const cartPaymentData = await getCartPayment();
      dispatch(setPaymentTypes(cartPaymentData?.getPaymentMethods));
    } else {
      const cartPaymentData = await getCartPaymentWithParam(pwaGuestToken);
      dispatch(setPaymentTypes(cartPaymentData?.getPaymentMethods));
    }
  };
  useEffect(() => {
    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      try {
        //  alert(notification?.launchURL || notification?.notification?.launchURL);
        const splash_screen = screenSettings[SCREEN_NAME_SPLASH];

        const DEEPLINK_CONFIG_DATA =
          splash_screen?.components?.DEEPLINK_CONFIG?.config?.regex;
        handleDeeplink({
          url: notification?.notification?.launchURL || notification?.launchURL,
          DEEPLINK_CONFIG_DATA,
          language,
          country,
          navigation,
        });
      } catch (e) {
        logError(e);
      }
      // handleDeeplink({url: notification?.launchURL, })
      // setNavigateToDeeplinkOrUniversalLink(notification?.launchURL);
      // alert(
      //   `FROM ONE SIGNAL OPEN HANDLER: ${JSON.stringify(notification || {})}`
      // );
    });
  }, []);

  useEffect(() => {
    getDeliveryType();
    getPaymentTypes();
  }, [cart]);

  useEffect(() => {
    if (userToken) {
      getCustomerData();
      getWishlist(dispatch);
    } else {
      getCartData();
    }
  }, [pwaGuestToken, userToken]);

  useEffect(() => {
    if (guestCartData?.cartData?.items?.length) {
      dispatch(setUserCartItems(guestCartData));
    }
  }, [guestCartData]);

  const getCustomerData = async () => {
    await getCustomerProfile(
      { token: userToken, country, language, updateAnalytics: true },
      dispatch
    );
    const { data, error } = await getCartForCustomerData();
    if (error) {
      // The below function used for retrying for the cart incase of any failure
      await createEmptyCart();
      try {
        const { data } = await getCartForCustomerData();
        // dispatch(addCartLoader(true));
        dispatch(setUserCartItems(data));
      } catch (e) {
        logError(e);
      }
      dispatch(removeCartLoader(false));
    } else if (data) {
      dispatch(setUserCartItems(data));
    }
  };
  const getCartData = async () => {
    await getCart({
      variables: { cart_id: pwaGuestToken },
    });
  };

  useEffect(() => {
    if (guestCartError && pwaGuestToken) {
      resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
    }
  }, [guestCartError]);

  const { homePageData, homePageLoading, homePageFailed } = useSelector(
    (state) => state.landing
  );
  useEffect(() => {
    if (countryData && language) {
      if (isEmpty(homePageData) && !homePageLoading) {
        const newCountryData = { ...countryData };
        if (pageId) {
          newCountryData.pageId = pageId;
        }
        getHomePage({ countryData: newCountryData, language }, dispatch);
      }
      if (!quickActionsAdded && country && language) {
        setQuickActionsAdded(true);
      }
    }
  }, [language, country, countryData, pageId]);

  useEffect(() => {
    if (!homePageLoading && !homePageFailed) {
      const { getPage = [] } = homePageData || {};

      const { selectRows = [] } = getPage?.[0] || [];
      const pageName = getPage?.[0]?.pageName;
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,

        params: {
          screen_name: SCREEN_NAME_HOME,
          country,
          language,
          page_name: pageName,
          promotional_page_name: '',
          number_of_rows: selectRows.length,
          number_of_product_carsousel: selectRows?.filter(
            (row) => row.type === 'ProductCarousel'
          )?.length,
          number_of_banner_carousel: selectRows?.filter(
            (row) => row.type === 'BannerCarousel'
          )?.length,
          number_of_image_grids: selectRows?.filter(
            (row) => row.type === 'ImageGrid'
          )?.length,
          number_of_image_scroller: selectRows?.filter(
            (row) => row.type === 'ImageScroller'
          )?.length,
        },
      });
    }
    if (homePageFailed) {
      logError(new Error('HOME PAGE FAILED TO LOAD'));
      Analytics_Events({
        eventName: 'Screen_View_Error',
        params: {
          screen_name: SCREEN_NAME_HOME,
          country,
          language,
          error: homePageFailed,
        },
      });
    }
  }, [homePageLoading]);

  const onRefresh = () => {
    setRefreshing(!refreshing);
    getHomePage({ countryData, language }, dispatch);
    wait(2000).then(() => setRefreshing(false));
  };

  const { getPage = [] } = homePageData || {};

  const { selectRows = [] } = getPage?.[0] || [];

  const orderTrackingPermission = async () => {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === 'not-determined') {
      const status = await requestTrackingPermission();
      if (status === 'authorized' || status === 'unavailable') {
        // enable tracking features

        Analytics_Events({ eventName: 'AppTracking_OptIn', params: {} });
      } else {
        Analytics_Events({
          eventName: 'AppTracking_OptOut',
          params: {},
          EventToken: 'qfj0js',
        });
      }
    }
  };

  useEffect(() => {
    //Prompt for push on iOS
    // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    //   if (response) {
    //     Analytics_Events({ eventName: 'AppPush_OptIn', params: {},EventToken:'aex5wf' });
    //   } else {
    //     Analytics_Events({ eventName: 'AppPush_OptOut', params: {},EventToken:'br618t' });
    //   }

    // });

    orderTrackingPermission();

    const { getPage = [] } = homePageData || {};

    const pageName = getPage?.[0]?.pageName;

    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: SCREEN_NAME_HOME,
        country,
        language,
        page_name: pageName,
        previous_screen: '',

        is_deferred_deeplink,
        landed_from_url,
        via,
        landed_from_push_notification,
      },
      EventToken: 'qbj2pa',
    });

    navigation.setOptions({
      title: '',
      headerLeft: HeaderLeft,
      headerTitleStyle: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 20,
        fontWeight: '',
        color: '#333333',
      },
      headerStyle: {
        shadowOpacity: 100,
        shadowOffset: {
          height: 2,
        },
        shadowRadius: 2,
      },
    });
  }, []);

  const onViewRef = useRef((viewableItemsData) => {
    const indexes = viewableItemsData?.viewableItems?.map((item) => {
      return item.index;
    });
    dispatch(setCurrentViewableRowsIndexes(indexes));
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 20 });

  const fireBannerPromotionEvent = (
    item,
    bannerIndex,
    row_index,
    widget,
    currentViewableRowsIndexesFromWidget,
    promotionsImpressionsIdArrFromWidget
  ) => {
    let customData = {
      promotion_id: item.widgets[bannerIndex]?.mobile_media?.sys?.id,
      promotion_name: item.widgets[bannerIndex]?.widgetName,
      creative_name: item.widgets[bannerIndex]?.widgetName,
      creative_slot: `slot${row_index}_${bannerIndex}`,
      // screen_name: SCREEN_NAME_HOME,
      // country,
      // language,
    };

    let checkIdAlreadyExists = [
      promotionsImpressionsIdArr,
      ...(promotionsImpressionsIdArrFromWidget || []),
    ]?.includes(item.widgets[bannerIndex]?.mobile_media?.sys?.id);
    if (
      !checkIdAlreadyExists &&
      item.widgets[bannerIndex]?.mobile_media?.sys?.id &&
      (
        currentViewableRowsIndexesFromWidget || currentViewableRowsIndexes
      ).includes(row_index)
    ) {
      let customeArr = [item.widgets[bannerIndex]?.mobile_media?.sys?.id];
      dispatch(setPromotionsImpressionsIdArr(customeArr));

      Analytics_Events({
        eventName: 'Promotions_Impressions',
        params: customData,
        EventToken: '2urzbt',
      });
    }
  };

  {
    /* { =================== Product Impressions =================== } */
  }

  const handleBannerPromotionImpression = ({
    colIndex: bannerIndex,
    rowIndex,
    rowData: item,
    widget,
    currentViewableRowsIndexesFromWidget,
    promotionsImpressionsIdArrFromWidget,
  }) => {
    fireBannerPromotionEvent(
      item,
      bannerIndex,
      rowIndex,
      widget,
      currentViewableRowsIndexesFromWidget,
      promotionsImpressionsIdArrFromWidget
    );
  };

  const HeaderLeft = () => {
    return (
      <View
        style={{
          marginLeft: 12,
          marginRight: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <View
            style={{
              padding: 10,
              transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
            }}
          >
            <BackArrow height={15} width={15} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const HomeScreenList = useMemo(() => {
    return (
      <FlatList
        ItemSeparatorComponent={
          Platform.OS !== 'android' &&
          (({ highlighted }) => (
            <Block
              style={[
                //  style.separator,
                highlighted && { marginLeft: 0 },
              ]}
            />
          ))
        }
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
        extraData={selectRows || refreshing}
        data={selectRows}
        contentContainerStyle={{ paddingBottom: 25 }}
        refreshing={refreshing}
        ListEmptyComponent={<HomeScreenShimmer />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        renderItem={({ item, index, separators }) => {
          return (
            <Block style={item?.widgetContainerStyleMobile}>
              {/* style={item?.widgetContainerStyle} */}
              {/* {==================== BannerCarousel =====================} */}
              {item?.type === 'BannerCarousel' ? (
                <BannerCarousel
                  rowData={item}
                  row_index={index}
                  banner={item}
                  navigation={navigation}
                  bannerPromotions={handleBannerPromotionImpression}
                  screen_name={SCREEN_NAME_HOME}
                />
              ) : null}

              {/* {==================== ImageScroller =====================} */}
              {item?.type === 'ImageScroller' ? (
                <ImageScroller
                  rowIndex={index}
                  rowData={item}
                  navigation={navigation}
                  scrollerImageWidth={scrollerImageWidth}
                  bannerPromotions={handleBannerPromotionImpression}
                  screen_name={SCREEN_NAME_HOME}
                />
              ) : null}

              {/* {==================== ProductCarousel =====================} */}
              {item?.type === 'ProductCarousel' ? (
                <ProductCarousel
                  OnPressWishlist={() => {
                    setIsLoginModal(true);
                  }}
                  rowIndex={index}
                  rowData={item}
                  navigation={navigation}
                />
              ) : null}

              {/* {==================== ImageGrid =====================} */}
              {item?.type === 'ImageGrid' ? (
                <Block style={{ paddingHorizontal: 8 }}>
                  <ImageGridContainer
                    rowIndex={index}
                    rowData={item}
                    navigation={navigation}
                    bannerPromotions={handleBannerPromotionImpression}
                  />
                </Block>
              ) : null}
              <Login
                isShowModal={isLoginModal}
                onModalClose={() => setIsLoginModal(false)}
              />
            </Block>
          );
        }}
      />
    );
  }, [refreshing, selectRows]);
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={STATUS_BAR_COLOR_BLACK}
        barStyle={'dark-content'}
      />
      <Block style={{ flex: 1 }} color={colors.white}>
        {!pageId ? <LogoCallBackSearchHeader navigation={navigation} /> : null}

        {homePageLoading ? <Loader /> : HomeScreenList}
      </Block>
    </>
  );
}
export default HomeScreen;
