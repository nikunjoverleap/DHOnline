import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ElevatedView from 'react-native-elevated-view';

import StyleSheetFactory from './WishlistStyle';
import TrashSvg from '../../../assets/svg/Trash.svg';
import {
  removeSingleProductFromWishlist,
  moveSingleProductToCart,
} from './actions';
import { env } from '../../src/config/env';
import { logInfo } from '../../helper/Global';

export default WishlistItem = ({ navigation, componentData, item }) => {
  const dispatch = useDispatch();
  const { language, country } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMovingToCart, setIsMovingToCart] = useState(false);

  let styles = StyleSheetFactory.getSheet(language);
  const { product } = item;

  const removeProductFromWishlist = async () => {
    setIsDeleting(true);
    const data = await removeSingleProductFromWishlist(item?.id, dispatch);
    setIsDeleting(false);
  };

  const moveProductToCart = async () => {
    setIsMovingToCart(true);
    const data = await moveSingleProductToCart(item?.id, dispatch);
    setIsMovingToCart(false);
  };
  logInfo(product, 'w--p', language);

  return (
    <ElevatedView elevation={1} style={styles.listItem}>
      <View style={styles.listItemImg}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('PDP', {
              url: `${env.BASE_URL}${country}/${language}/` + product?.url_key,
              productId: product?.sku,
            });
          }}
        >
          <FastImage
            style={{ width: 120, height: 120, borderRadius: 4 }}
            source={{
              uri: product?.thumbnail?.url,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.listItemRightSection}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PDP', {
                url:
                  `${env.BASE_URL}${country}/${language}/` + product?.url_key,
                productId: product?.sku,
              });
            }}
          >
            <Text style={styles.itemName} numberOfLines={2}>
              {product.name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.currencyLabel}>
              {product?.price?.minimalPrice?.amount?.currency}
            </Text>
          </View>
          <View>
            <Text style={styles.nowPriceLabel}>
              {product?.price?.minimalPrice?.amount?.value}
            </Text>
          </View>
          {product?.price?.minimalPrice?.amount?.value <
          product?.price?.regularPrice?.amount?.value ? (
            <View>
              <Text style={styles.wasPrice}>
                {`${product?.price?.regularPrice?.amount?.currency} ${product?.price?.regularPrice?.amount?.value}`}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.row, { paddingTop: 14 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => removeProductFromWishlist()}
          >
            <View>
              {isDeleting ? (
                <ActivityIndicator size="small" color="#D12E27" />
              ) : (
                <TrashSvg height={23} width={20} />
              )}
            </View>
          </TouchableOpacity>
          <View style={{ paddingLeft: 35, paddingRight: 35 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => moveProductToCart()}
            >
              <View style={styles.btn}>
                {isMovingToCart ? (
                  <View style={{ paddingRight: 8 }}>
                    <ActivityIndicator size="small" color="#D12E27" />
                  </View>
                ) : null}
                <View>
                  <Text>{componentData?.moveToCartBtnLabel}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ElevatedView>
  );
};
