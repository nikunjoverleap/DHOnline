import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

import Block from '../Block';

import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../ProductCard';
import moment from 'moment';
import WidgetHeader from '../WidgetHeader';
import { Analytics_Events } from '../../helper/Global';
import { setProductImpressions } from '../../slicers/analytic/analyticSlice';
import { DEFAULT_BRAND, FONT_FAMILY_ENGLISH_REGULAR } from '../../constants';
import ProductCardCrossPlay from '../ProductCardCrossPlay';
import { logProductClicks } from '../../helper/products';

const { width } = Dimensions.get('window');

export const ProductCarousel = ({ rowData, navigation, rowIndex }) => {
  const { language, country } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  {
    /* { =================== Product Clicks =================== } */
  }
  const onProductPress = (item, index) => {
    logProductClicks({ items: [item], rowData, rowIndex, index });
    // item?.categories?.map((dataObj) => {
    //   if (dataObj?.level === 2) {
    //     categoriesLevel2 = dataObj?.name;
    //   } else if (dataObj?.level === 3) {
    //     categoriesLevel3 = dataObj?.name;
    //   } else if (dataObj?.level === 4) {
    //     categoriesLevel4 = dataObj?.name;
    //   }
    // });
    return false;
    const {
      categoriesLevel1,
      categoriesLevel2,
      categoriesLevel3,
      name,
      brand,
    } = item?.fields || {};

    let customData = {
      items: [
        {
          item_brand: brand || DEFAULT_BRAND, // TO DO
          item_category: categoriesLevel1,
          item_category2: categoriesLevel2,
          item_category3: categoriesLevel3,
          item_id: item?.id,
          item_list_id: rowData?.rowName,
          item_list_name: rowData?.rowName,
          item_name: name,
          // item_location_id: `slot${rowIndex}_${index}`,
          price: parseFloat(item?.selectedPrice?.specialPrice),
        },
      ],
    };

    Analytics_Events({
      eventName: 'Product_Clicks',
      params: customData,
      EventToken: 'mvyf34',
    });
  };
  const [impressed, setImpressed] = useState([]);
  const fireProductImpressionsEvent = ({ items }) => {
    // setProductIdArr((ids) => {
    let customeArr = [];
    let customData = {
      item_list_id: rowData?.rowName,
      item_list_name: rowData?.rowName,
      items: [],
    };
    items?.map((el, index) => {
      const {
        item: { product },
      } = el;
      const { categoryLevel1, categoryLevel2, categoryLevel3, name, brand } =
        product?.fields || {};

      if (!impressed.includes(product?.id)) {
        customData.items.push({
          item_brand: brand || DEFAULT_BRAND,
          item_category: categoryLevel1 || '',
          item_category2: categoryLevel2 || '',
          item_category3: categoryLevel3 || '',
          item_id: product?.id,
          item_list_id: rowData?.rowName,
          item_list_name: rowData?.rowName,
          item_name: name,
          //  item_location_id: `slot${rowIndex}_${index}`,
          price: parseFloat(product?.selectedPrice?.specialPrice ?? 0.0),
        });
      }
      setImpressed([...impressed, product?.id]);
    });
    if (customData.items.length) {
      Analytics_Events({
        eventName: 'Product_Impressions',
        params: customData,
        EventToken: 'k3ah8d',
      });
    }

    dispatch(setProductImpressions(customData));
  };

  {
    /* {==================== Product Container =====================} */
  }

  if (
    rowData?.countDownTimerEndDate &&
    !moment().isBefore(moment(rowData?.countDownTimerEndDate))
  ) {
    return true;
  }

  const { currentViewableRowsIndexes } = useSelector((state) => state.analytic);

  const [viewable, setViewable] = useState([]);
  const onViewRef = useRef((viewableItemsData) => {
    setViewable(viewableItemsData?.changed || []);
  });
  // const onViewRef = useCallback(({ viewableItems }) => {
  //   productImpressions(viewableItems?.viewableItems);
  // }, []);
  useEffect(() => {
    if (currentViewableRowsIndexes.includes(rowIndex)) {
      if (viewable?.length) {
        fireProductImpressionsEvent({ items: viewable, rowIndex });
      }
    }
  }, [currentViewableRowsIndexes, viewable]);

  return rowData?.products?.length > 0 ? (
    <Block style={styles.marginTop10}>
      {rowData?.title ? (
        <WidgetHeader
          title={rowData?.title}
          expiryTimestamp={
            rowData?.countDownTimerEndDate
              ? new Date(rowData?.countDownTimerEndDate)
              : null
          }
        />
      ) : null}

      <FlatList
        horizontal={true}
        data={rowData?.csProducts}
        onViewableItemsChanged={onViewRef.current}
        keyExtractor={(_, index) => index.toString()}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10, paddingLeft: 10 }}
        // inverted={true}
        style={language === 'ar' ? { flexDirection: 'row-reverse' } : {}}
        renderItem={({ item, index }) => (
          <ProductCardCrossPlay
            item={item.product}
            navigation={navigation}
            onProductPress={onProductPress}
            rowIndex={rowIndex}
            productIndex={index}
            rowData={rowData}
          />
        )}
        // renderItem={({ item }) => productContainer(item)}
      />
    </Block>
  ) : null;
};

const styles = StyleSheet.create({
  productContainerMainViewStyle: {
    width: width / 2.7,
    marginHorizontal: 5,
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  productContainerImageStyle: {
    width: '100%',
    aspectRatio: 1,
  },
  flexDirectionRow: { flexDirection: 'row' },
  productDetailsNameTextViewStyle: { marginVertical: 5, flex: 1 },
  productDetailsNameTextStyle: {
    fontSize: 10,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  cartAndLikeIconViewStyle: { flexDirection: 'row', alignSelf: 'center' },
  marginRight7: { marginRight: 7 },
  garyLineViewStyle: {
    width: '95%',
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  PriceAndDiscountPriceView: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  regularPriceCurrencyTextStyle: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  amountValueTextStyle: {
    textDecorationLine: 'line-through',
    fontSize: 8,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  marginTop10: { marginTop: 10 },
  youSaveAndPerTextViewStyle: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  youSaveTextStyle: {
    fontSize: 8,
    fontWeight: '400',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: 'rgba(0,0,0,0.4)',
  },
  youSaveAmountTextStyle: {
    fontSize: 9,
    fontWeight: '500',
    color: 'orange',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  discountPerTextStyle: {
    fontSize: 9,
    fontWeight: '500',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
});
