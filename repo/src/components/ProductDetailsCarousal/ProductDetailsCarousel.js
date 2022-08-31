import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Block from '../Block';
import { ProductDetailsCarouselItem } from './ProductDetailsCarouselItem';
import StyleSheetFactory from './ProductDetailCarouselStyle';

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

const ProductDetailsCarousel = ({ navigation, product, handle360Button }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const ref = React.useRef(null);

  // const {
  //   product,
  //   navigation = { navigation },
  //   row_index,
  //   onChangeProductDetails = () => {},
  //   screen_name,
  // } = props;
  let styles = StyleSheetFactory.getSheet();

  const baseOptions = {
    // vertical: false,
    width: PAGE_WIDTH,
    height: PAGE_WIDTH,
  };

  return (
    <Block
      style={{
        width: PAGE_WIDTH,
        // height: PAGE_WIDTH,
      }}
    >
      <Block
        flex={false}
        style={{
          width: PAGE_WIDTH,
          height: PAGE_WIDTH,
        }}
      >
        <Carousel
          {...baseOptions}
          scrollAnimationDuration={0}
          ref={ref}
          autoPlay={false}
          data={product}
          modeConfig={{
            snapDirection: 'left',
          }}
          onSnapToItem={(index) => {
            setCurrentIndex(index);
          }}
          renderItem={({ index, item }) => {
            return (
              <ProductDetailsCarouselItem
                key={index}
                index={index}
                // row_index={row_index}
                productDetailItem={item}
                navigation={navigation}
                handle360Button={handle360Button}
                // screen_name={screen_name}
                product={product}
              />
            );
          }}
        />
        {/* <Carousel
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
            bannerPromotions(valueOfIndex);
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
      /> */}
      </Block>
      <Block style={styles.paginationContainer}>
        {product?.map((item, index) => {
          return (
            <Block
              flex={false}
              style={[
                styles.paginationDots,
                {
                  backgroundColor:
                    currentIndex === index ? '#e01c30' : '#dddddd',
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

export default ProductDetailsCarousel;
