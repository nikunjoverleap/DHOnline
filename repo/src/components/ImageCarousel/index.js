import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { targetToNewUrl } from '../../helper/url';
import { setWebViewVisible } from '../../slicers/auth/authSlice';
import { handleNavigateToPlp } from '../../utils/product';
import Block from '../Block';
import Text from '../Text';
import { env } from '../../src/config/env';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
import { logInfo } from '../../helper/Global';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');

export const ImageScroller = ({
  rowIndex,
  rowData,
  scrollerImageWidth = 300,
  flatlistLayoutWidth,
  isCategorieScreen,
  bannerPromotions = () => {},
  screen_name,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { country, language } = useSelector((state) => state.auth);
  const { currentViewableRowsIndexes, promotionsImpressionsIdArr } =
    useSelector((state) => state.analytic);
  {
    /* {==================== ImageContainer =====================} */
  }
  const imageDataContainer = (item, bannerIndex) => {
    const uri =
      item?.mobile_media?.fields?.file?.url || item?.media?.fields?.file?.url;

    let ImageRatio =
      item?.mobile_media?.fields?.file?.details?.image?.width /
      item?.mobile_media?.fields?.file?.details?.image?.height;
    return (
      <Block flex={false}>
        <TouchableOpacity
          onPress={() => {
            if (item?.targetType === 'external') {
              Linking.canOpenURL(item?.targetLink).then((supported) => {
                if (supported) {
                  InAppBrowser.open(item?.targetLink);
                  // Linking.openURL(item?.targetLink);
                } else {
                  logInfo("Don't know how to open URI: " + item?.targetLink);
                }
              });
            } else {
              if (item?.targetMode === 'PLP') {
                handleNavigateToPlp({
                  navigation,
                  plpCategoryId: item?.targetLink,
                  plpCategoryName: item?.title,
                  creativeName: item?.creativeNameForTracking,
                  widgetName: item?.widgetName,
                  previous_screen: screen_name,
                });
              } else if (item?.targetMode === 'PDP') {
                navigation.navigate('PDP', {
                  url:
                    `${env.BASE_URL}${country}/${
                      language === 'ae_en' ? 'en' : 'ar'
                    }/` + item?.targetLink,
                });
              } else if (item?.targetMode === 'Landing Page') {
                navigation.navigate('LandingPage', {
                  pageId: item?.targetLink,
                  creativeName: item?.creativeNameForTracking,
                  widgetName: item?.widgetName,
                });
              } else {
                handleNavigateToPlp({
                  navigation,
                  plpCategoryId: item?.targetLink,
                  plpCategoryName: item?.title,
                  previous_screen: screen_name,
                });
              }
            }
          }}
          style={[
            styles.imageDataContainerMAinViewStyle,
            {
              width: isCategorieScreen ? flatlistLayoutWidth / 3 : width / 3,
            },
          ]}
          activeOpacity={0.8}
        >
          {/* <Image
            style={[
              styles.imageStyle,
              {
                aspectRatio: ImageRatio && ImageRatio !== 0 ? ImageRatio : 1,
              },
            ]}
            source={{
              uri: `https:${uri}`,
            }}
          /> */}
          <FastImage
            style={[
              styles.imageStyle,
              {
                aspectRatio: ImageRatio && ImageRatio !== 0 ? ImageRatio : 1,
              },
            ]}
            source={{
              uri: `https:${uri}?w=${scrollerImageWidth}`,
            }}

            //  resizeMode={FastImage.resizeMode.contain}
          />
          {item?.title ? (
            <Text
              style={[
                styles.imageDataContainerTitleTextStyle,
                {
                  fontSize: isCategorieScreen ? 10 : 12,
                  fontFamily:
                    language === 'ar'
                      ? FONT_FAMILY_ARABIC_REGULAR
                      : FONT_FAMILY_ENGLISH_REGULAR,
                },
              ]}
            >
              {item?.title}
            </Text>
          ) : null}
        </TouchableOpacity>
      </Block>
    );
  };
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
      {/* {==================== Row Title =====================} */}
      {rowData?.title ? (
        <Block style={styles.ImageScrollerMainViewStyle}>
          <Text
            style={[
              styles.ImageScrollerTitleTextStyle,
              {
                fontSize: isCategorieScreen ? 12 : 16,
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

      {/* {==================== Row Data Flatlist =====================} */}
      <FlatList
        data={rowData?.widgets}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
        renderItem={({ item, bannerIndex }) =>
          imageDataContainer(item, bannerIndex)
        }
        contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
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
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
    paddingLeft: 8,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  marginTop15: { marginTop: 15 },
  imageDataContainerMAinViewStyle: {
    marginRight: 8,
  },
  imageStyle: {
    width: '100%',
  },
  imageDataContainerTitleTextStyle: {
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
    paddingTop: 5,
    color: '#707070',
    fontSize: 14,
  },
});
