import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import isEmpty from 'lodash.isempty';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import FastImage from 'react-native-fast-image';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import Favorite from '../../../assets/svg/Favorite.svg';
import FavoriteSelected from '../../../assets/svg/FavoriteSelected';
import MultiColorSvg from '../../../assets/svg/MultiColor.svg';
import MultiSizeSvg from '../../../assets/svg/Size.svg';
import { GENERIC_ERROR_MESSAGE, SCREEN_NAME_PLP } from '../../constants';
import { colors } from '../../constants/theme';
import {
  addToCartLogEvent,
  logAddToWishlist,
  logRemoveFromWishlist,
} from '../../helper/cart';
import {
  apiResponseLog,
  logError,
  logInfo,
  showToast,
} from '../../helper/Global';
import { ADD_TO_CART } from '../../helper/gql';
import { logProductClicks } from '../../helper/products';

import LoginRegisterScreen from '../../screens/LoginRegister/LoginRegisterScreen';
import {
  resetQuestQuoteInCaseThereAErrorInTheCart,
  saveCartItemCustomer,
} from '../../screens/MyCart/actions';
import {
  addProductToWishlist,
  removeSingleProductFromWishlist,
} from '../../screens/WishList/actions';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import { env } from '../../src/config/env';
import Block from '../Block';
import { espTransform } from '../PriceFormatFunction';
import StyleSheetFactory from './ProductCardStyle';

const vibrateFeedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
function ProductCard({
  item,
  onProductPress = () => {},
  index,
  imageWidth,
  plpMetaData,
  disableRelatedProductVariant = false,
  hasMoreOptions = false,
  rowData = {},
  rowIndex = 0,
  productIndex = 0,
}) {
  const navigation = useNavigation();
  const { language, country, pwaGuestToken, userToken } = useSelector(
    (state) => state.auth
  );
  let styles = StyleSheetFactory.getSheet(language);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [isAddToCartLoaderVisible, setIsAddToCartLoaderVisible] =
    useState(false);
  const { screenSettings } = useSelector((state) => state.screens);
  const plpScreenSettings = screenSettings[SCREEN_NAME_PLP];
  const componentData =
    plpScreenSettings?.components['PLP Data']?.componentData;
  const dispatch = useDispatch();
  const { wishlistSkuList, wishlistProductList } = useSelector(
    (state) => state.wishlist
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAnimationEnabled, setIsFavoriteAnimationEnabled] =
    useState(false);
  const toggleSigninModal = () => {
    setIsSignInModalVisible(!isSignInModalVisible);
  };

  const [
    saveCartItem,
    {
      data: addToCartResponse,
      error: addToCartGuestError,
      loading: addToCartLoading,
    },
  ] = useMutation(ADD_TO_CART);
  const ONE_SECOND_IN_MS = 10;

  const PATTERN = [1 * ONE_SECOND_IN_MS];

  const handleAddToCart = async (item) => {
    if (item?.type_id === 'grouped') {
      navigation.navigate('PDP', {
        productId: item?.id,
        productDetail: item,
      });
      return null;
    }

    if (userToken) {
      try {
        setIsAddToCartLoaderVisible(true);
        const add = {
          sku: item?.sku,
          product_type: item?.type_id || 'simple',
          qty: 1,
          quantity: 1,
        };
        const { data, error } = await saveCartItemCustomer(add);
        setIsAddToCartLoaderVisible(false);
        if (error) {
          apiResponseLog('saveCartItemCustomer', add, data, error);
          ReactNativeHapticFeedback.trigger(
            'notificationError',
            vibrateFeedbackOptions
          );
          showToast({
            message: GENERIC_ERROR_MESSAGE(language, error?.message), // TO DO TRANSLATION AND ERROR MESSAGE
            type: 'error',
            position: 'bottom',
          });
          resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
        } else {
          logInfo('saveCartItem==>> Customer', data);
          if (data?.saveCartItem) {
            dispatch(setUserCartItems(data?.saveCartItem));
          }
          showToast({
            message: 'Successfully added to the cart',
            type: 'success',
            position: 'bottom',
          });
          ReactNativeHapticFeedback.trigger(
            'notificationSuccess',
            vibrateFeedbackOptions
          );
          addToCartLogEvent({
            dataDefinition: 'crossplay',
            productData: item,
            rowData,
            rowIndex,
            productIndex,
            plpMetaData,
          });
        }
      } catch (e) {
        apiResponseLog(
          'saveCartItem Common',
          { country, language, ...item },
          {},
          e
        );
        resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
        showToast({
          message: GENERIC_ERROR_MESSAGE(language, e.message),
          type: 'error',
          position: 'bottom',
        }); // TODO TRANSLATION AND ERROR MESSAGE

        ReactNativeHapticFeedback.trigger(
          'notificationError',
          vibrateFeedbackOptions
        );
      }
    } else {
      try {
        let guestToken = pwaGuestToken;
        if (!guestToken) {
          guestToken = await resetQuestQuoteInCaseThereAErrorInTheCart(
            dispatch
          );
        }
        let data = await saveCartItem({
          variables: {
            cartItem: {
              sku: item?.sku,
              product_type: item?.type_id || 'simple',
              qty: 1,
              quantity: 1,
            },
            guestCartId: `${guestToken}`,
          },
        });
        if (data?.saveCartItem) {
          dispatch(setUserCartItems(data?.saveCartItem));
        }
        showToast({
          message: 'Successfully added to the cart', // TODO take message from contentful
          type: 'success',
          position: 'bottom',
        });

        logInfo('saveCartItem==>>', data);
        setIsAddToCartLoaderVisible(false);
        const options = {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        };

        ReactNativeHapticFeedback.trigger(
          'notificationSuccess',
          vibrateFeedbackOptions
        );
        addToCartLogEvent({
          dataDefinition: 'crossplay',
          productData: item,
          rowData,
          rowIndex,
          productIndex,
          plpMetaData,
        });
      } catch (error) {
        apiResponseLog(
          'saveCartItem resetQuestQuoteInCaseThereAErrorInTheCart',
          { country, language, ...item },
          {},
          error
        );
        showToast({
          message: GENERIC_ERROR_MESSAGE(language, error.message),
          type: 'error',
          position: 'bottom',
        });

        ReactNativeHapticFeedback.trigger(
          'notificationError',
          vibrateFeedbackOptions
        );
      }
      setIsAddToCartLoaderVisible(false);
    }
  };

  useEffect(() => {
    if (addToCartResponse?.saveCartItem?.cart?.items?.length) {
      //  dispatch(setUserCartItems(addToCartResponse));
    }
  }, [addToCartResponse]);

  // Add Item To WishList API
  const addToWishlist = async (item) => {
    try {
      setIsFavorite(true);
      setIsFavoriteAnimationEnabled(true);
      const data = {
        quantity: 1,
        sku: item?.sku,
      };
      await addProductToWishlist(data, dispatch);
      ReactNativeHapticFeedback.trigger(
        'notificationSuccess',
        vibrateFeedbackOptions
      );
      logAddToWishlist({
        dataDefinition: 'crossplay',
        productData: item,
        rowData,
        rowIndex,
        productIndex,
        plpMetaData,
      });
    } catch (e) {
      ReactNativeHapticFeedback.trigger(
        'notificationError',
        vibrateFeedbackOptions
      );
      logError(e);
    }
  };

  const removeFromWishlist = async () => {
    try {
      let itemRmv = await wishlistProductList.filter((witem) => {
        return witem?.product?.sku === item?.sku;
      });
      if (itemRmv.length > 0) {
        setIsFavorite(false);
        setIsFavoriteAnimationEnabled(false);

        await removeSingleProductFromWishlist(itemRmv[0]?.id, dispatch);
      }
      logRemoveFromWishlist({
        dataDefinition: 'crossplay',
        productData: item,
        rowData,
        rowIndex,
        productIndex,
        plpMetaData,
      });
    } catch (e) {
      logError(e);
    }
  };

  useEffect(() => {
    if (wishlistSkuList?.includes(item?.sku)) {
      setIsFavorite(true);
    }
  }, [wishlistSkuList]);

  const handleWishListClick = () => {
    isEmpty(userToken) ? setIsSignInModalVisible(true) : addToWishlist(item);
  };
  const handleAfterSignIn = () => {
    addToWishlist(item);
  };

  const RenderRelatedProduct = () => {
    switch (item?.relatedProductVariantType) {
      case 'carpet_size':
      case 'mattress_size':
        return (
          <>
            <Block flex={false}>
              <MultiSizeSvg height={15} width={15} />
            </Block>
            <Block flex={false}>
              <Text numberOfLines={2} style={styles.multiColorSizeLabel}>
                {`${item?.relatedProductCount} ${componentData?.MultiSizeLabel}`}
              </Text>
            </Block>
          </>
        );
      case 'pattern_size':
        return (
          <>
            <Block flex={false}>
              <MultiSizeSvg height={15} width={15} />
            </Block>
            <Block flex={false}>
              <Text numberOfLines={2} style={styles.multiColorSizeLabel}>
                {`${item?.relatedProductCount} ${componentData?.MultiSizeLabel}`}
              </Text>
            </Block>
          </>
        );
      case 'color':
        return (
          <>
            <Block flex={false}>
              <MultiColorSvg height={15} width={15} />
            </Block>
            <Block flex={false}>
              <Text numberOfLines={2} style={styles.multiColorSizeLabel}>
                {`${item?.relatedProductCount} ${componentData?.MultiColorLabel}`}
              </Text>
            </Block>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push('PDP', {
            url:
              `${env.BASE_URL}${country}/${language === 'en' ? 'en' : 'ar'}/` +
              item?.url_key,
            productId: item?.id,
            // productId: '810401101192', //Product colorlist
            // productId: '810806000882', // Product MattressSize list
            // productId: '810100200212-1', // Product GroupedProducts list
            productDetail: item,
          });
          onProductPress(item, index);
          logProductClicks({ items: [item], plpMetaData, index, rowIndex });
        }}
      >
        <Block flex={false} style={styles.container}>
          <Block flex={false} style={{ position: 'relative' }}>
            {/* <Image
              style={styles.img}
              resizeMode="contain"
              source={{
                uri: `https:${item?.images?.[0]?.value}?width=${imageWidth}}`,
              }}
            /> */}
            <FastImage
              style={
                plpMetaData?.image_orientation === 'Landscape'
                  ? styles.imgRectangle
                  : styles.imgSquare
              }
              source={{
                uri: `https:${item?.images?.[0]?.value}?w=${imageWidth}`,

                priority: FastImage.priority.normal,
              }}
              resizeMode={
                plpMetaData?.image_orientation === 'Landscape'
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.contain
              }
            />
            {item?.fields?.sale_badge ? (
              <ElevatedView elevation={0.2} style={styles.saleBadge}>
                <Text style={styles.saleBadgeLabel}>
                  {item?.fields?.sale_badge}
                </Text>
              </ElevatedView>
            ) : null}

            <Block style={styles.favIconContainer}>
              {isFavorite ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    isEmpty(userToken)
                      ? setIsSignInModalVisible(true)
                      : removeFromWishlist(item)
                  }
                  style={styles.favIconInnerContainer}
                >
                  {isFavoriteAnimationEnabled ? (
                    <LottieView
                      source={require('./favorite.json')}
                      autoPlay
                      loop={false}
                      resizeMode="contain"
                      style={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  ) : (
                    <FavoriteSelected height={15} width={15} />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleWishListClick}
                  style={styles.favIconInnerContainer}
                >
                  <Favorite height={15} width={15} />
                </TouchableOpacity>
              )}
            </Block>

            <View style={styles.bottomBadgeSection}>
              {item?.fields?.market_badge ? (
                <ElevatedView elevation={0.2} style={styles.marketBadge}>
                  <Text style={styles.marketBadgeLabel}>
                    {item?.fields?.market_badge}
                  </Text>
                </ElevatedView>
              ) : null}
              {item?.fields?.feature_badge ? (
                <ElevatedView elevation={0.2} style={styles.featureBadge}>
                  <Text style={styles.featureLabel}>
                    {item?.fields?.feature_badge}
                  </Text>
                </ElevatedView>
              ) : null}
              {item?.fields?.discount_badge ? (
                <ElevatedView elevation={0.2} style={styles.discountBadge}>
                  <Text style={styles.discountLabel}>
                    {item?.fields?.discount_badge}
                  </Text>
                </ElevatedView>
              ) : null}
            </View>
          </Block>
          <Block style={styles.bottomContainer}>
            <Block flex={false}>
              <Text numberOfLines={2} style={styles.nameLabel}>
                {item?.fields?.name}
              </Text>
            </Block>
            <Block flex={false} style={styles.leftRow}>
              <Block flex={false} style={styles.specialPriceContainer}>
                <Block flex={false}>
                  <Text style={styles.specialPriceCurrencyLabel}>
                    {item?.selectedPrice?.currency}
                  </Text>
                </Block>
                <Block flex={false}>
                  <Text style={styles.specialPriceLabel}>
                    {`${espTransform(item?.selectedPrice?.specialPrice)}`}
                  </Text>
                </Block>
              </Block>
              {item?.defaultPrice?.specialPrice &&
              item?.selectedPrice?.specialPrice <
                item?.defaultPrice?.specialPrice ? (
                <Block>
                  <Text style={styles.regularPriceLabel}>
                    {item?.defaultPrice?.currency}{' '}
                    {`${espTransform(item?.defaultPrice?.specialPrice)}`}
                  </Text>
                </Block>
              ) : null}
            </Block>
            {!disableRelatedProductVariant && hasMoreOptions ? (
              <Block flex={false} style={styles.multiColorSizeContainer}>
                {<RenderRelatedProduct />}
              </Block>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAddToCart(item)}
            >
              <Block
                style={[
                  styles.btn,
                  addToCartLoading || isAddToCartLoaderVisible
                    ? { backgroundColor: '#333333' }
                    : {},
                ]}
              >
                <Block center middle>
                  <Text style={styles.btnLabel}>
                    {addToCartLoading || isAddToCartLoaderVisible ? (
                      <LottieView
                        source={require('../../../assets/lottie/addToCart.json')}
                        autoPlay
                        loop={false}
                        resizeMode="contain"
                        style={{
                          width: 22,
                          height: 22,
                        }}
                      />
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
          afterSignIn={handleAfterSignIn}
        />
      ) : null}
    </SafeAreaView>
  );
}
export default ProductCard;
