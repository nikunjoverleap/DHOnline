import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import Remove from '../../../assets/svg/Remove.svg';
import WishList from '../../../assets/svg/_wishlist.svg';
import Block from '../../components/Block';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import colors from '../../styles/colors';
import {
  // getCustomerCartData,
  removeCartItem,
  removeCartItemCustomer,
  saveCartItem,
  saveCartItemCustomer,
  saveToWishlist,
} from './actions';

import { FONT_FAMILY_ENGLISH_REGULAR } from '../../constants';
import { logError } from '../../helper/Global';
import { logRemoveFromCart } from '../../helper/cart';
//import { useLazyQuery } from '@apollo/client';
//import { VIEW_CART_GUEST } from '../../helper/gql/query';

function CartItemContainer({
  item,
  productData,
  isDeleteAndHeartIconVisible = true,
  loginOnWishList,
  productCardLabels,
}) {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const { pwaGuestToken, userToken } = useSelector((state) => state.auth);
  const [isWishListLoaderVisible, setIsWishListLoaderVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Add To Cart API
  const addItemInCart = async (item, isIncreaseProductQty) => {
    try {
      setIsLoaderVisible(true);
      if (userToken) {
        const add = {
          sku: item?.product?.sku,
          product_type: item?.product?.__typename,
          qty: 1,
          quantity: 1,
        };
        const decrease = {
          sku: item?.product?.sku,
          item_id: item?.item_id,
          qty: item?.qty - 1,
          quantity: 1,
        };
        const { data } = await saveCartItemCustomer(
          isIncreaseProductQty ? add : decrease
        );
        dispatch(setUserCartItems(data?.saveCartItem));
        setIsLoaderVisible(false);
      } else {
        const add = {
          sku: item?.product?.sku,
          product_type: item?.product?.__typename,
          qty: 1,
          quantity: 1,
        };
        const decrease = {
          sku: item?.product?.sku,
          item_id: item?.item_id,
          qty: item?.qty - 1,
          quantity: 1,
        };
        const guestCartId = `${pwaGuestToken}`;

        const { data } = await saveCartItem(
          isIncreaseProductQty ? add : decrease,
          guestCartId
        );
        dispatch(setUserCartItems(data?.saveCartItem));
        setIsLoaderVisible(false);
      }
    } catch (e) {
      logError(e);
    }
  };

  // Remove Cart API
  const onDeleteIconPress = async (item) => {
    try {
      if (userToken) {
        setIsLoaderVisible(true);
        const { data } = await removeCartItemCustomer(item?.item_id);
        dispatch(setUserCartItems(data?.removeCartItem));
        setIsLoaderVisible(false);
      } else {
        setIsLoaderVisible(true);
        const { data } = await removeCartItem(item?.item_id, pwaGuestToken);
        dispatch(setUserCartItems(data?.removeCartItem));
        setIsLoaderVisible(false);
      }
      logRemoveFromCart({ items: [item] });
    } catch (e) {
      logError(e);
    }
  };

  const onToastSuccess = () => {
    Toast.show({
      type: 'general_toast',
      props: {
        message: 'Successfully Added to your Wishlist',
        success: true,
      },
    });
  };

  const onToastFail = () => {
    Toast.show({
      type: 'general_toast',
      props: {
        message: 'Something went wrong',
        success: false,
      },
    });
  };

  // const [
  //   getCart,
  //   // eslint-disable-next-line no-unused-vars
  //   { loading: guestCartLoading, error: guestCartError, data: guestCartData },
  // ] = useLazyQuery(VIEW_CART_GUEST);

  // const getCartData = async () => {
  //   await getCart({
  //     variables: { cart_id: pwaGuestToken },
  //   });
  //   if (guestCartData?.cartData?.items?.length) {
  //     dispatch(setUserCartItems(guestCartData));
  //   }
  // };

  const addItemToWishlist = async (item) => {
    setIsWishListLoaderVisible(true);
    const itemData = {
      quantity: item?.qty,
      sku: item?.sku,
    };
    try {
      await saveToWishlist(itemData);
      onToastSuccess();
    } catch (error) {
      onToastFail();
    }
    setIsWishListLoaderVisible(false);

    //TODO: uncomment when  removeCartItem API issue fixed
    // const { data, error } = await removeCartItemCustomer(item?.item_id);
    // if (error) {
    //   setIsWishListLoaderVisible(false);
    //   onToastFail();
    // }
    // if (data) {
    //   if (userToken) {
    //     await getCustomerCartData(dispatch);
    //   } else {
    //     getCartData();
    //   }
    //   onToastSuccess();
    //   setIsWishListLoaderVisible(false);
    // }
  };

  return (
    <Block
      flex={false}
      padding={9}
      style={
        !isDeleteAndHeartIconVisible
          ? {
              borderWidth: 1,
              borderColor: '#e7e7e7',
              marginTop: 10,
              borderRadius: 4,
            }
          : {
              borderWidth: 1,
              borderColor: colors.grey_3,
              borderRadius: 4,
              marginBottom: 15,
            }
      }
    >
      <Block opacity={isLoaderVisible ? 0.5 : 1}>
        <TouchableOpacity
          onPress={() => {
            navigation.push('PDP', {
              productId: item?.sku,
              productDetail: item,
            });
          }}
        >
          <Block flex={false} row width={'100%'} center>
            <Block flex={false} height={121} width={121}>
              <Image
                source={{ uri: item?.product?.thumbnail?.url }}
                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              />
            </Block>

            <Block
              padding={[0, 0, 0, 10]}
              space={'between'}
              width={!isDeleteAndHeartIconVisible ? '70%' : '100%'}
            >
              <Block flex={false}>
                {/* <Text
                numberOfLines={1}
                style={[
                  styles.descriptionText,
                  { fontSize: !isDeleteAndHeartIconVisible ? 14 : 14 },
                ]}
              >
                {item?.product?.name}
              </Text> */}
                <DanubeText style={styles.productName}>
                  {item?.product?.name}
                </DanubeText>
                {isDeleteAndHeartIconVisible ? (
                  <DanubeText
                    style={{ marginBottom: 9 }}
                    variant={TextVariants.XXS}
                  >
                    {productCardLabels?.item_code} {item?.product?.sku}
                  </DanubeText>
                ) : null}
                {item?.you_save > 0 && (
                  <DanubeText style={styles.savedText}>
                    You Saved {productCardLabels?.saved_label}{' '}
                    {/**TODO Transation */}
                    {/**TODO Transation */}
                    {productData?.cartData?.base_currency_code} {item?.you_save}
                  </DanubeText>
                )}

                {!isDeleteAndHeartIconVisible && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                      color: '#333333',
                    }}
                  >
                    QTY - {item?.qty} {/**TODO Transation */}
                  </Text>
                )}
                <View style={styles.price}>
                  <DanubeText
                    variant={TextVariants.XS}
                    style={{ paddingTop: 1 }}
                  >
                    {productData?.cartData?.base_currency_code}
                  </DanubeText>
                  <DanubeText
                    variant={TextVariants.Base}
                    bold
                    style={styles.total}
                  >
                    {item?.row_total}
                  </DanubeText>
                  {item?.you_save > 0 ? (
                    <DanubeText style={styles.strike}>
                      {' '}
                      {productData?.cartData?.base_currency_code}{' '}
                      {item?.row_total + item?.you_save}
                    </DanubeText>
                  ) : null}
                </View>
              </Block>
            </Block>
          </Block>
        </TouchableOpacity>

        {isDeleteAndHeartIconVisible && (
          <Block
            flex={false}
            height={1}
            width={'100%'}
            color={'#e7e7e7'}
            margin={[10, 0, 0, 0]}
          />
        )}

        {isDeleteAndHeartIconVisible && (
          <Block
            flex={false}
            width={'100%'}
            margin={[10, 0, 0, 0]}
            row
            space={'between'}
          >
            <Block flex={false} row space={'between'} center>
              {isDeleteAndHeartIconVisible && (
                <Block flex={false} middle center>
                  <Block
                    flex={false}
                    style={styles.minusPlusButtonView}
                    center
                    middle
                    row
                  >
                    {/* Minus Button */}
                    <TouchableOpacity
                      style={styles.minusButtonView}
                      onPress={() => addItemInCart(item, false)}
                      disabled={item?.qty === 1 ? true : false}
                    >
                      <Text style={styles.minusButtonSize}>-</Text>
                    </TouchableOpacity>

                    {/* Item Count */}
                    <Block style={styles.minusButtonView}>
                      <DanubeText style={styles.counterText}>
                        {item?.qty}
                      </DanubeText>
                    </Block>

                    {/* Plus Button */}
                    <TouchableOpacity
                      style={styles.minusButtonView}
                      onPress={() => {
                        addItemInCart(item, true);
                      }}
                    >
                      <DanubeText style={styles.plusButtonText}>+</DanubeText>
                    </TouchableOpacity>
                  </Block>
                </Block>
              )}
            </Block>
            <Block flex={false} row space={'between'} center>
              <TouchableOpacity
                style={styles.wishListIconView}
                onPress={() => {
                  userToken ? addItemToWishlist(item) : loginOnWishList();
                }}
              >
                {!isWishListLoaderVisible && <WishList />}
                {isWishListLoaderVisible && (
                  <ActivityIndicator size="small" color="#B00009" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteIconView}
                onPress={() => {
                  onDeleteIconPress(item);
                }}
              >
                <Remove />
              </TouchableOpacity>
            </Block>
          </Block>
        )}
      </Block>
      {isLoaderVisible && (
        <Block
          height={'100%'}
          width={'100%'}
          center
          middle
          style={{ position: 'absolute' }}
        >
          <ActivityIndicator size="small" color="#B00009" />
        </Block>
      )}
    </Block>
  );
}
export default CartItemContainer;

const styles = StyleSheet.create({
  descriptionText: {
    fontFamily: 'Roboto-Bold',
    color: '#454545',
  },
  itemCodeText: {
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#333333',
  },
  youSaveText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#3a9c0a',
  },
  minusPlusButtonView: {
    borderWidth: 1,
    borderColor: colors.black_4,
    borderRadius: 5,
    height: 37,
    width: 121,
  },
  minusButtonView: {
    height: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButtonSize: {
    fontSize: 22,
  },
  counterText: {
    fontSize: 14,
  },
  plusButtonText: {
    fontSize: 18,
  },
  itemOldPriceText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#b2b2b2',
    textDecorationLine: 'line-through',
  },
  itemNewPrice: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#333333',
    marginLeft: 10,
  },
  deleteIconView: {
    marginRight: 17,
  },
  wishListIconView: {
    marginRight: 43,
  },
  savedText: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 7,
  },
  productName: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 6,
  },
  price: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  strike: {
    fontSize: 13,
    color: colors.grey_4,
    textDecorationLine: 'line-through',
  },
  total: {
    marginLeft: 3,
  },
});
