import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSelector } from 'react-redux';
import Block from '../Block';
import Text from '../Text';
import { BannerCaroselItem } from './BannerCaroselItem';
import StyleSheetFactory from './BannerCarouselStyle';

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

const BannerCarousel = (props) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { currentViewableRowsIndexes = [], promotionsImpressionsIdArr = [] } =
    useSelector((state) => state.analytic);
  const ref = React.useRef(null);

  const {
    banner,
    flatlistLayoutWidth,
    isCategorieScreen = false,
    navigation = { navigation },
    row_index,
    bannerPromotions = () => {},
    screen_name,
    rowData,
  } = props;
  let styles = StyleSheetFactory.getSheet();

  const baseOptions = {
    vertical: false,
    width: isCategorieScreen ? flatlistLayoutWidth : PAGE_WIDTH,
    height: isCategorieScreen ? flatlistLayoutWidth / 2 : PAGE_WIDTH / 2,
  };

  return (
    <Block
      margin={[5, 0, 0, 0]}
      style={{
        flex: 1,
        width: isCategorieScreen ? flatlistLayoutWidth : '100%',
      }}
    >
      {banner.title && (
        <Block>
          <Text style={styles.rowTitle}>{banner.title}</Text>
        </Block>
      )}
      <Carousel
        {...baseOptions}
        loop={banner?.isLooping}
        ref={ref}
        autoPlay={banner?.isAutoPlay}
        autoPlayReverse={banner?.isRTL}
        autoPlayInterval={banner?.autoPlayInterval}
        defaultIndex={banner?.isRTL ? banner?.widgets?.length - 1 : 0}
        modeConfig={{
          snapDirection: 'left',
        }}
        data={banner.widgets}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onSnapToItem={(index) => {
          setCurrentIndex(index);
        }}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          let valueOfIndex = absoluteProgress;
          if (!valueOfIndex.toString().includes('.')) {
            // bannerPromotions(valueOfIndex);
            bannerPromotions({
              rowData,
              colIndex: currentIndex,
              rowIndex: row_index,
              currentViewableRowsIndexesFromWidget: currentViewableRowsIndexes,
              promotionsImpressionsIdArrFromWidget: promotionsImpressionsIdArr,
            });
          }
        }}
        renderItem={({ index, item }) => {
          return (
            <BannerCaroselItem
              key={index}
              index={index}
              row_index={row_index}
              bannerItem={item}
              navigation={navigation}
              screen_name={screen_name}
            />
          );
        }}
      />
      <Block style={styles.paginationContainer}>
        {banner.widgets.map((item, index) => {
          return (
            <Block
              flex={false}
              style={[
                styles.paginationDots,
                {
                  backgroundColor: currentIndex === index ? '#e01c30' : '#fff',
                },
              ]}
              key={index}
            ></Block>
          );
        })}
      </Block>
    </Block>
  );
};

export default BannerCarousel;
