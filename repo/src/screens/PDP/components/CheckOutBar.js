import isEmpty from 'lodash.isempty';
import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch, useSelector } from 'react-redux';
import Favorite from '../../../../assets/svg/HeartIcon.svg';
import FavoriteSelected from '../../../../assets/svg/FavoriteSelected';
import Block from '../../../components/Block';
import UpdateProductQty from '../../../components/UpdateProductQty';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  GENERIC_ERROR_MESSAGE,
} from '../../../constants';
import colors from '../../../styles/colors';
import {
  addProductToWishlist,
  removeSingleProductFromWishlist,
} from '../../WishList/actions';
import LoginRegisterScreen from '../../LoginRegister/LoginRegisterScreen';
import Toast from 'react-native-toast-message';
import { logError, logInfo } from '../../../helper/Global';
import { logAddToWishlist } from '../../../helper/cart';

export const CheckOutBar = ({
  handleAddToCartButton = () => {},
  isAddToCartLoaderVisible,
  productDetail,
  navigation,
  productCount,
  setProductCount = () => {},
}) => {
  const { cartItems } = useSelector((state) => state.cart ?? []);
  const { language, userToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const { wishlistSkuList, wishlistProductList } = useSelector(
    (state) => state.wishlist
  );
  const toggleSigninModal = () => {
    setIsSignInModalVisible(!isSignInModalVisible);
  };

  const quantity = cartItems?.cartData?.items.filter((data) => {
    return data?.sku === productDetail?.sku;
  });

  const [counter, setCounter] = useState(quantity?.[0]?.qty || 1);

  useEffect(() => {
    setCounter(productCount);
  }, [productCount]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAnimationEnabled, setIsFavoriteAnimationEnabled] =
    useState(false);

  const addToWishlist = async (item) => {
    try {
      setIsFavorite(true);
      setIsFavoriteAnimationEnabled(true);
      const data = {
        quantity: 1,
        sku: item?.sku,
      };
      await addProductToWishlist(data, dispatch);
      ReactNativeHapticFeedback.trigger('notificationSuccess');
      logAddToWishlist({
        dataDefinition: 'catalog',
        productData: productDetail,
        productIndex: 0,
        rowIndex: 0,
      });
    } catch (e) {
      ReactNativeHapticFeedback.trigger('notificationError');
      Toast.show({
        type: 'general_toast',
        props: {
          message: GENERIC_ERROR_MESSAGE(language, e.message), // TODO Translation contentful
          success: false,
        },
      });
      logError(e);
    }
  };
  const handleWishListClick = () => {
    isEmpty(userToken)
      ? setIsSignInModalVisible(true)
      : addToWishlist({ sku: productDetail._id, dataDefinition: 'pdp' });
  };
  const handleAfterSignIn = () => {
    addToWishlist({ sku: productDetail._id, dataDefinition: 'pdp' });
  };
  const removeFromWishlist = async () => {
    let itemRmv = await wishlistProductList.filter((witem) => {
      return witem?.product?.sku === productDetail._id;
    });
    if (itemRmv.length > 0) {
      setIsFavorite(false);
      setIsFavoriteAnimationEnabled(false);

      await removeSingleProductFromWishlist(itemRmv[0]?.id, dispatch);
    }
  };
  useEffect(() => {
    if (wishlistSkuList?.includes(productDetail._id)) {
      setIsFavorite(true);
    }
  }, [wishlistSkuList]);

  logInfo(productDetail, 'productDetail---add');

  return (
    <View style={styles.shadow}>
      <Block
        flex={false}
        width={'100%'}
        row
        selfcenter
        space={'between'}
        center
        padding={[10]}
        // style={styles.mainView}
        style={{ backgroundColor: '#fff' }}
      >
        {/* <TouchableOpacity
          style={{ height: 20, width: 20 }}
          onPress={addToWishlist}
        >
          {isFavoriteAnimationEnabled ? (
            <AnimatedLottieView
              source={require('../../../../assets/lottie/favorite.json')}
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
          <HeartIcon height={'100%'} width={'100%'} />
        </TouchableOpacity> */}
        {isFavorite ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              isEmpty(userToken)
                ? setIsSignInModalVisible(true)
                : removeFromWishlist({ sku: productDetail._id })
            }
            style={styles.favIconInnerContainer}
          >
            {isFavoriteAnimationEnabled ? (
              <AnimatedLottieView
                source={require('../../../../assets/lottie/favorite.json')}
                autoPlay
                loop={false}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            ) : (
              <FavoriteSelected height={24} width={24} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleWishListClick}
            style={styles.favIconInnerContainer}
          >
            <Favorite height={24} width={24} />
          </TouchableOpacity>
        )}
        <Block flex={1} margin={[0, 10, 0, 10]}>
          <UpdateProductQty
            counter={counter}
            onPlusPress={() => {
              if (counter < productDetail?.inventoryStock?.qty) {
                setCounter(counter + 1);
                setProductCount(counter + 1);
              }
            }}
            onMinusPress={() => {
              if (counter > 0) {
                setCounter(counter - 1);
                setProductCount(counter - 1);
              }
            }}
          />
        </Block>

        <TouchableOpacity
          style={[
            styles.addToCartTextView,
            quantity?.[0]?.qty === counter ? styles.addToCartSuccees : {},
          ]}
          onPress={() => {
            isEmpty(quantity)
              ? handleAddToCartButton(counter, true)
              : quantity?.[0]?.qty === counter
              ? navigation.navigate('My Cart')
              : handleAddToCartButton(
                  counter,
                  quantity?.[0]?.qty < counter ? true : false,
                  true
                );
          }}
          disabled={isAddToCartLoaderVisible}
        >
          {isAddToCartLoaderVisible ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={styles.addToCartText}>
              {/** TODO Translation from contentful */}
              {isEmpty(quantity)
                ? 'ADD TO CART'
                : quantity?.[0]?.qty === counter
                ? 'GO TO CART'
                : 'UPDATE CART'}
            </Text>
          )}
        </TouchableOpacity>
      </Block>
      {isSignInModalVisible ? (
        <LoginRegisterScreen
          isVisible={isSignInModalVisible}
          toggleSigninModal={toggleSigninModal}
          navigation={navigation}
          afterSignIn={handleAfterSignIn}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  shadow: {
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  addToCartTextView: {
    height: 45,
    width: '60%',
    backgroundColor: '#2F2F2F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  addToCartSuccees: {
    backgroundColor: '#3a9c0a',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  minusText: {
    fontSize: 30,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  PlusText: {
    fontSize: 20,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  minusPlusButtonView: {
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 5,
    height: 45,
    marginHorizontal: 10,
  },
  plusButtonView: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  qtyTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  counterText: {
    fontSize: 18,
    color: '#424242',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
});
