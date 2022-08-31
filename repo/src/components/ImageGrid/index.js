import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
  SCREEN_NAME_PLP,
} from '../../constants';
import Block from '../Block';
import Text from '../Text';
import { ImageItemContainer } from './ImageItemContainer';

export const ImageGridContainer = ({
  rowData,
  navigation,
  rowIndex,
  bannerPromotions = () => {},
}) => {
  const { language, country } = useSelector((state) => state.auth);
  const { currentViewableRowsIndexes = [], promotionsImpressionsIdArr = [] } =
    useSelector((state) => state.analytic);

  const [viewable, setViewable] = useState([]);
  const onViewRef = useRef((viewableItemsData) => {
    setViewable(viewableItemsData?.changed || []);
  });
  useEffect(() => {
    if (currentViewableRowsIndexes.includes(rowIndex)) {
      viewable?.map((item) => {
        bannerPromotions({
          rowData,
          colIndex: item.index,
          rowIndex,
          currentViewableRowsIndexesFromWidget: currentViewableRowsIndexes,
          promotionsImpressionsIdArrFromWidget: promotionsImpressionsIdArr,
        });
      });
    }
  }, [currentViewableRowsIndexes]);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 20 });
  return (
    <Block>
      {/* {==================== ImageGrid Title =======================} */}
      {rowData?.title ? (
        <Block style={styles.ImageScrollerMainViewStyle}>
          <Text
            style={[
              styles.ImageScrollerTitleTextStyle,
              {
                fontFamily:
                  language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
              },
            ]}
          >
            {rowData?.title}
          </Text>
        </Block>
      ) : (
        <Block style={styles.marginTop15} />
      )}

      {/* {==================== ImageGrid FlatList =======================} */}
      <FlatList
        data={rowData?.widgets}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item, index }) => (
          <ImageItemContainer
            widgetCount={rowData?.widgets?.length}
            item={item}
            index={index}
            navigation={navigation}
            onPressImage={() =>
              navigation.navigate(SCREEN_NAME_PLP, { url: item?.targetLink })
            }
          />
        )}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  ImageScrollerMainViewStyle: {
    marginTop: 20,
    marginBottom: 10,
  },
  ImageScrollerTitleTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
    color: '#333333',
  },
  marginTop15: { marginTop: 15 },
});
