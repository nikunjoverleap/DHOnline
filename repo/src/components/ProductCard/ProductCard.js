import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import ProductCardStyle from './ProductCardStyle';
import CustomerCare from '../../../assets/svg/CustomerCare.svg';
import Search from '../../../assets/svg/Search.svg';
import { colors } from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import Block from '../Block';
import { espTransform } from '../PriceFormatFunction';
import { env } from '../../src/config/env';
import Favorite from '../../../assets/svg/Favorite.svg';
import { useMutation } from '@apollo/client';
import { getDHStore } from '../../helper/country';
import LoginRegisterScreen from '../../screens/LoginRegister/LoginRegisterScreen';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import { ADD_TO_CART } from '../../helper/gql';
import isEmpty from 'lodash.isempty';
import { addItemToWishlist, wishList } from '../../screens/Home/actions';
import { addProductToWishlist } from '../../screens/WishList/actions';
import { saveCartItemCustomer } from '../../screens/MyCart/actions';
import { Analytics_Events, logInfo } from '../../helper/Global';
import useApiErrorsHandler from '../../helper/useApiErrorHandler';
import { DEFAULT_BRAND, EVENT_NAME_ADD_TO_CART } from '../../constants';

function ProductCard({
  item,
  navigation,
  onProductPress,
  index,
  row_index,
  productIndex,
  rowData,
}) {
  const { language, country, pwaGuestToken, userToken } = useSelector(
    (state) => state.auth
  );
  let styles = ProductCardStyle.getSheet(language);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isAddToCartLoaderVisible, setIsAddToCartLoaderVisible] =
    useState(false);
  const dispatch = useDispatch();

  const toggleSigninModal = () => {
    setIsSignInModalVisible(!isSignInModalVisible);
  };

  const { width } = Dimensions.get('window');
  const handleApiError = useApiErrorsHandler();

  const [
    saveCartItem,
    {
      data: addToCartResponse,
      error: addToCartGuestError,
      loading: addToCartLoading,
    },
  ] = useMutation(ADD_TO_CART);

  const handleAddToCart = async (item) => {
    if (userToken) {
      setIsAddToCartLoaderVisible(true);
      const add = {
        sku: item?.sku,
        product_type: item?.type_id,
        qty: 1,
        quantity: 1,
      };
      const { data } = await saveCartItemCustomer(add);
      setIsAddToCartLoaderVisible(false);
      logInfo('saveCartItem==>> Customer', data);
      if (data?.saveCartItem?.length) {
        dispatch(setUserCartItems(data?.saveCartItem));
      }
      addToCartLogEvent(item);
    } else {
      // Guest Flow
      try {
        let data = await saveCartItem({
          variables: {
            cartItem: {
              sku: item?.sku,
              product_type: item?.type_id,
              qty: 1,
              quantity: 1,
            },
            guestCartId: `${pwaGuestToken}`,
          },
        });
        if (data?.saveCartItem?.length) {
          dispatch(setUserCartItems(data?.saveCartItem));
        }
        addToCartLogEvent(item);
      } catch (error) {
        logInfo('=====Errorr', error);
        handleApiError(error);
        setIsAddToCartLoaderVisible(false);
      }
    }
  };

  const addToCartLogEvent = (productData) => {
    let customData = {};
    let categoriesLevel2 = '';
    let categoriesLevel3 = '';
    let categoriesLevel4 = '';

    productData.categories?.map((dataObj) => {
      if (dataObj?.level === 2) {
        categoriesLevel2 = dataObj?.name;
      } else if (dataObj?.level === 3) {
        categoriesLevel3 = dataObj?.name;
      } else if (dataObj?.level === 4) {
        categoriesLevel4 = dataObj?.name;
      }
    });

    customData = {
      currency: productData?.price?.minimalPrice?.amount?.currency,
      items: [
        {
          item_brand: DEFAULT_BRAND, //TODO Identify Brand
          item_category: categoriesLevel2,
          item_category2: categoriesLevel3,
          item_category3: categoriesLevel4,
          item_id: productData?.sku,
          item_list_id: rowData?.rowName,
          item_list_name: rowData?.rowName,
          item_name: productData?.name,
          // item_location_id: `slot${row_index}_${productIndex}`,
          price: parseFloat(productData?.special_price),
        },
      ],
      value: parseFloat(productData?.special_price),
    };

    Analytics_Events({
      eventName: EVENT_NAME_ADD_TO_CART,
      params: customData,
    });
  };

  useEffect(() => {
    if (addToCartResponse?.saveCartItem?.cart?.items?.length) {
      dispatch(setUserCartItems(addToCartResponse));
    }
  }, [addToCartResponse]);

  // Add Item To WishList API
  const addToWishlist = async (item) => {
    var data = {
      quantity: 1,
      sku: item?.sku,
    };
    const res = await dispatch(addProductToWishlist(data));
    logInfo(res, 'success-wish');
    // addProductToWishlist();
    // addItemToWishlist(data);
    // wishList();
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PDP', {
            url:
              `${env.BASE_URL}${country}/${
                language === 'ae_en' ? 'en' : 'ar'
              }/` + item?.url_key,
            productId: item?.sku,
            // productId: '810401101192', //Product colorlist
            // productId: '810806000882', // Product MattressSize list
            // productId: '810100200212-1', // Product GroupedProducts list
            productDetail: item,
          });
          onProductPress(item, index);
        }}
      >
        <Block flex={false} style={styles.container}>
          <Block flex={false} style={{ position: 'relative' }}>
            <Image
              style={styles.img}
              resizeMode="contain"
              source={{
                uri: item?.thumbnail?.url,
              }}
            />
            {item?.sale_badge ? (
              <Block style={styles.saleBadge}>
                <Text style={styles.saleBadgeLabel}>{item?.sale_badge}</Text>
              </Block>
            ) : null}

            <Block style={styles.favIconContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  isEmpty(userToken)
                    ? setIsSignInModalVisible(true)
                    : addToWishlist(item)
                }
              >
                <Favorite height={20} width={20} />
              </TouchableOpacity>
            </Block>

            <Block style={styles.bottomBadgeSection}>
              {item?.market_badge ? (
                <Block style={styles.marketBadge}>
                  <Text style={styles.marketBadgeLabel}>
                    {item?.market_badge}
                  </Text>
                </Block>
              ) : null}
              {item?.feature_badge ? (
                <Block style={styles.featureBadge}>
                  <Text style={styles.featureLabel}>{item?.feature_badge}</Text>
                </Block>
              ) : null}

              {/* <Block style={styles.saleBadge}>
              <Text style={styles.saleBadgeLabel}>New</Text>
            </Block> */}
            </Block>
          </Block>
          <Block style={styles.bottomContainer}>
            <Block flex={false}>
              <Text numberOfLines={2} style={styles.nameLabel}>
                {item?.name}
              </Text>
            </Block>
            <Block flex={false} style={styles.leftRow}>
              <Block flex={false} style={styles.specialPriceContainer}>
                <Block flex={false}>
                  <Text style={styles.specialPriceCurrencyLabel}>
                    {item?.price?.regularPrice?.amount?.currency}
                  </Text>
                </Block>
                <Block flex={false}>
                  <Text style={styles.specialPriceLabel}>
                    {`${espTransform(item?.special_price)}`}
                  </Text>
                </Block>
              </Block>

              <Block flex={false}>
                <Text style={styles.regularPriceLabel}>
                  {item?.price?.regularPrice?.amount?.currency}{' '}
                  {`${espTransform(item?.price?.regularPrice?.amount?.value)}`}
                </Text>
              </Block>
            </Block>
            {/* <Block flex={false}>
              <Text numberOfLines={2} style={styles.featureLabel}>
                2 Colours
              </Text>
            </Block> */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAddToCart(item)}
            >
              <Block style={styles.btn}>
                <Block center middle>
                  <Text style={styles.btnLabel}>
                    {addToCartLoading || isAddToCartLoaderVisible ? (
                      <ActivityIndicator size="small" color="#B00009" />
                    ) : (
                      'ADD TO CART'
                    )}
                  </Text>
                </Block>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </TouchableOpacity>
      {isSignInModalVisible ? (
        <LoginRegisterScreen
          isVisible={isSignInModalVisible}
          toggleSigninModal={toggleSigninModal}
          navigation={navigation}
        />
      ) : null}
    </SafeAreaView>
  );
}
export default ProductCard;
