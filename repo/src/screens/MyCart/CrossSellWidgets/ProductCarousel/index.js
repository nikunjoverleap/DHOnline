import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import Block from '../../../../components/Block';
import WidgetHeader from '../../../../components/WidgetHeader';
import ProductCard from '../../../../components/ProductCard';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../../../constants';

const { width } = Dimensions.get('window');

export const ProductCarousel = ({
  rowData,
  navigation,

  rowIndex,
}) => {
  const { language, country } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  {
    /* { =================== Product Clicks =================== } */
  }
  const onProductPress = (item, index) => {
    let categoriesLevel2 = '';
    let categoriesLevel3 = '';
    let categoriesLevel4 = '';

    item?.categories?.map((dataObj) => {
      if (dataObj?.level === 2) {
        categoriesLevel2 = dataObj?.name;
      } else if (dataObj?.level === 3) {
        categoriesLevel3 = dataObj?.name;
      } else if (dataObj?.level === 4) {
        categoriesLevel4 = dataObj?.name;
      }
    });

    let customData = {
      items: [
        {
          item_brand: 'item_brand', // TO DO
          item_category: categoriesLevel2,
          item_category2: categoriesLevel3,
          item_category3: categoriesLevel4,
          item_id: item?.sku,
          item_list_id: rowData?.rowName,
          item_list_name: rowData?.rowName,
          item_name: item?.name,
          //  item_location_id: `slot${rowIndex}_${index}`,
          price: parseFloat(item?.special_price),
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
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.item?.categories?.map((dataObj) => {
        if (dataObj?.level === 2) {
          categoriesLevel2 = dataObj?.name;
        } else if (dataObj?.level === 3) {
          categoriesLevel3 = dataObj?.name;
        } else if (dataObj?.level === 4) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      if (!impressed.includes(el?.item?.sku)) {
        customData.items.push({
          item_brand: el?.item?.brand,
          item_category: categoriesLevel2,
          item_category2: categoriesLevel3,
          item_category3: categoriesLevel4,
          item_id: el?.item?.sku,
          item_list_id: rowData?.rowName,
          item_list_name: rowData?.rowName,
          item_name: el?.item?.name,
          // item_location_id: `slot${rowIndex}_${index}`,
          price: parseFloat(el?.item?.special_price),
        });
      }
      setImpressed([...impressed, el?.item?.sku]);
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
        data={rowData?.products}
        onViewableItemsChanged={onViewRef.current}
        keyExtractor={(_, index) => index.toString()}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 10 }}
        // inverted={true}
        style={language === 'ar' ? { flexDirection: 'row-reverse' } : {}}
        renderItem={({ item, index }) => (
          <ProductCard
            item={item}
            navigation={navigation}
            onProductPress={onProductPress}
            row_index={rowIndex}
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
