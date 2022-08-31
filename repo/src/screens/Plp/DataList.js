import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ProductCardCrossPlay from '../../components/ProductCardCrossPlay';
import {
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  FONT_FAMILY_ENGLISH_REGULAR,
  SCREEN_NAME_MY_CART,
  SCREEN_NAME_PLP,
  SCREEN_NAME_WISHLIST,
} from '../../constants';
import { getProductList } from './actions';
import ProductListVerticalShimmer from '../../components/Shimmer/ProductListVerticalShimmer';
import SubCategoryList from './components/SubCategoryList';
import PlpBanner from './components/PlpBanner';
import { PLP_STICKY_BANNER, PLP_DATA } from './constants';
const BLOCK_TYPE_PRODUCT = 'product';
const ROW_TYPE_GRID = 'column-grid';
const ROW_TYPE_BANNER = 'horizontal-banner';
import CartIcon from '../../../assets/svg/CartBlack.svg';
import WishlistIcon from '../../../assets/svg/WishlistBlack.svg';
import BackArrow from '../../../assets/svg/BackArrow.svg';

import { Badge } from 'react-native-paper';
import { handleNavigateToPlp } from '../../utils/product';
import { useNavigation } from '@react-navigation/native';
import { Analytics_Events, logInfo } from '../../helper/Global';
import EmptyPlp from './EmptyPlp';
import { productImpressionEvents } from '../../helper/products';

const PLPRow = ({
  rowType,
  hasMoreOptions = false,
  columns = [],
  bannerLink,
  navigation,
  imageWidth,
  plpMetaData,
  rowIndex = 0,
  disableRelatedProductVariant = false,
}) => {
  switch (rowType) {
    case ROW_TYPE_BANNER: {
      return <PlpBanner uri={bannerLink} navigation={navigation} />;
    }
    default:
      return null;
    case ROW_TYPE_GRID:
      return (
        <View style={{ flexDirection: 'row' }}>
          {columns?.map(({ type, product }, index) => {
            return (
              <PLPBLockItem
                disableRelatedProductVariant={disableRelatedProductVariant}
                key={type === 'product' ? product.id : ''}
                type={type}
                hasMoreOptions={hasMoreOptions}
                product={product}
                navigation={navigation}
                imageWidth={imageWidth}
                plpMetaData={plpMetaData}
                rowIndex={rowIndex}
                productIndex={index}
              />
            );
          })}
        </View>
      );
  }
};
const PLPBLockItem = ({
  type,
  product,
  navigation,
  imageWidth,
  plpMetaData,
  hasMoreOptions = false,
  disableRelatedProductVariant = false,
  rowIndex = 0,
  productIndex = 0,
}) => {
  switch (type) {
    default:
    case BLOCK_TYPE_PRODUCT:
      return (
        <View style={{ flexDirection: 'column' }}>
          <ProductCardCrossPlay
            hasMoreOptions={hasMoreOptions}
            disableRelatedProductVariant={disableRelatedProductVariant}
            item={product}
            navigation={navigation}
            imageWidth={imageWidth}
            plpMetaData={plpMetaData}
            rowIndex={rowIndex}
            productIndex={productIndex}
          />
        </View>
      );
  }
};
const { width } = Dimensions.get('window');

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const HeaderRight = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const navigation = useNavigation();

  const { wishlistProductList } = useSelector((state) => state.wishlist);

  const handleNavigateToCart = () => {
    // TO DO Add Click Analytics here

    navigation.navigate(SCREEN_NAME_MY_CART, {
      previous_screen: SCREEN_NAME_PLP,
    });
  };
  return (
    <View style={{ flexDirection: 'row', width: 100 }}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => {
          // TO DO Add Click Analytics here
          navigation.navigate(SCREEN_NAME_WISHLIST, {
            previous_screen: SCREEN_NAME_PLP,
          });
        }}
        style={{ flex: 1, alignItems: 'center', paddingRight: 22 }}
      >
        <WishlistIcon width={26} height={26} color="red" />
        {wishlistProductList.length ? (
          <Badge
            size={20}
            style={{
              fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
              backgroundColor: '#D12E27',
              position: 'absolute',
              left: 15,
              bottom: 14,
            }}
          >
            {wishlistProductList.length}
          </Badge>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={handleNavigateToCart}
        style={{ flex: 1, alignItems: 'center', paddingRight: 22 }}
      >
        <CartIcon width={26} height={26} />
        {cartItems?.cartData?.items?.length ? (
          <Badge
            size={20}
            style={{
              fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
              backgroundColor: '#D12E27',
              position: 'absolute',
              left: 15,
              bottom: 14,
            }}
          >
            {cartItems?.cartData?.items?.length}
          </Badge>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

function DataList({
  disableRelatedProductVariant = false,
  plpCategoryId,
  selectedFilters = [],
  navigation,
  query,
  selectedSortOption,
  numColumns = 2,
  horizontal = false,
  productId,
  type,
  recommendationId,
  userId,
  plpTFetchTimer,
  initialPageSize = 20,
  showWidgetHandler = () => {},
}) {
  const { screenSettings } = useSelector((state) => state.screens);
  const { country, language } = useSelector((state) => state.auth);
  const plpScreenSettings = screenSettings[SCREEN_NAME_PLP];
  const stickyBannerData =
    plpScreenSettings?.components[PLP_STICKY_BANNER]?.componentData;
  const PlpComponentData =
    plpScreenSettings?.components[PLP_DATA]?.componentData;

  const dispatch = useDispatch();
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [totalPages, setTotalPages] = useState(0);

  const [plpData, setPlpData] = useState([]);
  const [currentPaginationLoaded, setCurrentPaginationLoaded] = useState(true);
  const refDataList = useRef();
  const [plpMetaData, setPlpMetaData] = useState({});
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    if (plpData?.length === 0) {
      setIsLoading(true);
    }
    const data = await getProductList(
      {
        store: { country, language },
        categoryId: plpCategoryId,
        query,
        filters: selectedFilters,
        pageOffset,
        pageSize,
        numColumns,
        sort: selectedSortOption,
        productId,
        type,
        recommendationId,
        userId,
      },
      dispatch
    );
    if (!data?.list?.totalPages) {
      showWidgetHandler();
    }

    setIsLoading(false);
    if (pageOffset > 0) {
      setPlpMetaData(data?.list?.meta);
      setPlpData([...plpData, ...(data?.list?.blocks || [])]);
    } else {
      setPlpMetaData(data?.list?.meta);
      setPlpData([...(data?.list?.blocks || [])]);
    }
    setCurrentPaginationLoaded(true);
    if (!firstLoaded) {
      Analytics_Events(EVENT_NAME_SCREEN_VIEW_COMPLETE, {
        screen_name: SCREEN_NAME_PLP,
        country,
        language,
        plpCategoryId,
        query,
        number_of_products: data?.list?.totalPages,
        // To be added
      });
      setFirstLoaded(true);
    }

    setTotalPages(data?.list?.totalPages || 0);
  };
  useEffect(() => {
    setPageOffset(0);
    if (plpData.length > 0) {
      refDataList.current.scrollToIndex({ index: 0 });
    }
  }, [selectedFilters, selectedSortOption]);

  useEffect(() => {
    clearTimeout(plpTFetchTimer);
    plpTFetchTimer = setTimeout(() => {
      fetchProducts();
    }, 100);
  }, [pageOffset, selectedFilters, selectedSortOption]);

  const fetchMoreData = () => {
    if (pageOffset <= totalPages && currentPaginationLoaded) {
      setPageOffset(pageOffset + 1);
      setCurrentPaginationLoaded(false);
    }
  };

  const imageWidth = Math.ceil(width / 2 + 20);

  const onRefresh = () => {
    setRefreshing(!refreshing);
    setPageOffset(0);
    if (plpData.length > 0) {
      refDataList.current.scrollToIndex({ index: 0 });
    }
    wait(2000).then(() => setRefreshing(false));
  };

  useEffect(() => {
    let title = '';
    if (query) {
      title = query;
    } else {
      title =
        language === 'ar'
          ? plpMetaData?.ar_title || ''
          : plpMetaData?.en_title || '';
    }

    navigation?.setOptions({
      title,
      headerRight: HeaderRight,
      headerLeft: HeaderLeft,
      headerStyle: {},
      headerTitleStyle: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 20,
        color: '#333333',
      },
    });
  }, [plpMetaData]);

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
            <BackArrow height={18} width={15} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const [viewable, setViewable] = useState([]);
  const [impressed, setImpressed] = useState([]);
  const viewedItems = [];
  const onViewRef = useRef((viewableItemsData) => {
    setViewable(viewableItemsData?.changed || []);
  });
  useEffect(() => {
    if (viewable?.length) {
      const newImpressed = productImpressionEvents({
        items: viewable.map((row) => row.item.columns).flat(),
        plpMetaData,
        impressed,
      });
      setImpressed([...impressed, ...newImpressed]);
      // fireProductImpressionsEvent({ items: viewable });
    }
  }, [viewable]);

  return (
    <FlatList
      horizontal={horizontal}
      contentContainerStyle={{
        flexGrow: 1,
        paddingLeft: 10,
        paddingTop: 12,
        paddingBottom: horizontal ? 0 : 70,
        paddingRight: horizontal ? 30 : 0,
        backgroundColor: '#fff',
      }}
      refreshing={refreshing}
      refreshControl={
        horizontal ? null : (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        )
      }
      onViewableItemsChanged={onViewRef.current}
      data={plpData}
      extraData={plpData}
      renderItem={({ item, index }) => {
        return (
          <PLPRow
            {...item}
            disableRelatedProductVariant={disableRelatedProductVariant}
            key={item?.rowId}
            navigation={navigation}
            imageWidth={imageWidth}
            plpMetaData={plpMetaData}
            rowIndex={index}
          />
        );
      }}
      onEndReachedThreshold={horizontal ? 0.5 : 0.5}
      onMomentumScrollBegin={() => {
        setOnEndReachedCalledDuringMomentum(false);
      }}
      onEndReached={() => {
        if (!onEndReachedCalledDuringMomentum) {
          setOnEndReachedCalledDuringMomentum(true);
          fetchMoreData();
          logInfo('oend---api-call');
        }
      }}
      keyExtractor={(item) => item?.rowId}
      removeClippedSubviews={true}
      maxToRenderPerBatch={100}
      initialNumToRender={6}
      windowSize={21}
      ref={refDataList}
      ListEmptyComponent={() => {
        if (isLoading) {
          return <ProductListVerticalShimmer horizontal={horizontal} />;
        } else {
          return <EmptyPlp componentData={PlpComponentData} />;
        }
      }}
      ListFooterComponent={() => {
        if (!currentPaginationLoaded && !horizontal) {
          return (
            <SafeAreaView>
              <View style={{ height: 100 }}>
                <ActivityIndicator />
              </View>
            </SafeAreaView>
          );
        } else if (!currentPaginationLoaded && !horizontal) {
          <View style={{ height: 100 }}>
            <ActivityIndicator />
          </View>;
        }
        return null;
      }}
      ListHeaderComponent={() => {
        if (!horizontal && plpData?.length > 0) {
          const bannerData =
            (plpMetaData?.plp_banner?.bannerLink && plpMetaData?.plp_banner) ||
            stickyBannerData;
          return (
            <>
              <PlpBanner
                navigation={navigation}
                uri={
                  country &&
                  bannerData?.bannerLink?.[country]?.[language]?.imageLink
                }
                height={
                  country &&
                  bannerData?.bannerLink?.[country]?.[language]?.height
                }
                targetLink={
                  country &&
                  bannerData?.bannerLink?.[country]?.[language]?.targetLink
                }
              />
              <SubCategoryList
                data={plpMetaData?.top_categories}
                navigation={navigation}
              />
            </>
          );
        }
        return null;
      }}
    />
  );
}
export default DataList;
