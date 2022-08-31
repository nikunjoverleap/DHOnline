import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';

import BackSvg from '../../../assets/svg/BackArrow.svg';
import StyleSheetFactory from './WishlistStyle';
import WishlistItem from './WishlistItem';
import EmptyWishlist from './EmptyWishlist';
import {
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  SCREEN_NAME_WISHLIST,
} from '../../constants';
import { WISHLIST_DATA } from './constants';
import { getWishlist, clearWishlist, moveWishlistToCart } from './actions';
import { Analytics_Events } from '../../helper/Global';

export default WishListScreen = ({ navigation }) => {
  const { language, country } = useSelector((state) => state.auth);
  const { wishlistProductList, wishlistSkuList } = useSelector(
    (state) => state.wishlist
  );

  let styles = StyleSheetFactory.getSheet(language);
  const { screenSettings } = useSelector((state) => state.screens);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveAllLoader, setIsRemoveAllLoader] = useState(false);
  const [isMoveAllToCartLoader, setIsMoveAllToCartLoaderLoader] =
    useState(false);

  const wishlistScreenSettings = screenSettings?.[SCREEN_NAME_WISHLIST];
  const componentData =
    wishlistScreenSettings?.components[WISHLIST_DATA]?.componentData;
  const dispatch = useDispatch();

  const removeAllProductsFromWishlist = async () => {
    setIsRemoveAllLoader(true);
    const data = await clearWishlist(dispatch);
    setIsRemoveAllLoader(false);
  };

  const moveAllProductsToCart = async () => {
    setIsMoveAllToCartLoaderLoader(true);
    const data = await moveWishlistToCart(dispatch);
    setIsMoveAllToCartLoaderLoader(false);
  };

  const getWishlistProducts = async () => {
    setIsLoading(true);
    const data = await getWishlist(dispatch);
    if (data) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWishlistProducts();
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: { screen_name: SCREEN_NAME_WISHLIST, country, language },
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
        params: { screen_name: SCREEN_NAME_WISHLIST, country, language },
      });
    }
  }, [wishlistProductList]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={styles.backIcon}>
            <BackSvg height={18} width={15} />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{componentData?.wishlist}</Text>
        </View>
        <View style={{ width: 60 }}></View>
      </View>
      <View>
        <Text
          style={styles.countLabel}
        >{`${wishlistProductList?.length} ${componentData?.itemsInYourWishlist}`}</Text>
      </View>
      <ElevatedView elevation={2} style={styles.listContainer}>
        <FlatList
          data={wishlistProductList}
          extraData={wishlistProductList}
          renderItem={({ item }) => (
            <WishlistItem
              navigation={navigation}
              componentData={componentData}
              item={item}
            />
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 80,
            paddingTop: 30,
          }}
          ListEmptyComponent={() =>
            !isLoading ? (
              <EmptyWishlist
                navigation={navigation}
                componentData={componentData}
              />
            ) : null
          }
        />
      </ElevatedView>
      {wishlistProductList?.length > 0 ? (
        <ElevatedView elevation={2} style={styles.bottomStickyRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => removeAllProductsFromWishlist()}
          >
            <View style={styles.rmvAllBtn}>
              {isRemoveAllLoader ? (
                <View style={{ paddingRight: 8 }}>
                  <ActivityIndicator size="small" color="#D12E27" />
                </View>
              ) : null}
              <View>
                <Text style={styles.rmvAllBtnLabel}>
                  {componentData?.removeAllBtnLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => moveAllProductsToCart()}
          >
            <View style={styles.moveToCartBtn}>
              {isMoveAllToCartLoader ? (
                <View style={{ paddingRight: 8 }}>
                  <ActivityIndicator size="small" color="#D12E27" />
                </View>
              ) : null}
              <View>
                <Text style={styles.moveToCartBtnLabel}>
                  {componentData?.moveAllToCartBtnLabel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ElevatedView>
      ) : null}
    </View>
  );
};
