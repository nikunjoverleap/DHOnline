import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  View,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deviceWidth } from '../../constants/theme';
import { targetToNewUrl } from '../../helper/url';
import { setWebViewVisible } from '../../slicers/auth/authSlice';
import { handleNavigateToPlp } from '../../utils/product';
import Text from '../Text';
import StyleSheetFactory from './CategoryImageItemStyle';
import { env } from '../../src/config/env';
import { logInfo } from '../../helper/Global';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export const CategoryImageItem = ({
  item,
  widgetCount,
  rowData,
  onPressImage,
  isShowCategorie,
  isCategorieScreen,
  flatlistLayoutWidth,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let ImageRatio =
    item?.mobile_media?.fields?.file?.details?.image?.width /
    item?.mobile_media?.fields?.file?.details?.image?.height;
  const { language, country } = useSelector((state) => state.auth);
  const uri =
    item?.mobile_media?.fields?.file?.url || item?.media?.fields?.file?.url;

  let styles = StyleSheetFactory.getSheet(language, 'category');

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (item?.targetType === 'external') {
            Linking.canOpenURL(item?.targetLink).then((supported) => {
              if (supported) {
                // Linking.openURL(item?.targetLink);
                InAppBrowser.open(item?.targetLink);
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
              });
            } else if (item?.targetMode === 'PDP') {
              navigation.navigate('PDP', {
                url:
                  `${env.BASE_URL}${country}/${language}/` + item?.targetLink,
                creativeName: item?.creativeNameForTracking,
                widgetName: item?.widgetName,
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
                creativeName: item?.creativeNameForTracking,
                widgetName: item?.widgetName,
              });
            }
          }
        }}
        style={[
          styles.imageItemContainerMainViewStyle,
          {
            width: isCategorieScreen
              ? (flatlistLayoutWidth -
                  (rowData?.gridSizeMobile === 1 ? 0 : 20)) /
                rowData?.gridSizeMobile
              : rowData?.widgets?.length > 1
              ? deviceWidth / 2.3
              : deviceWidth,
            marginRight: rowData?.gridSizeMobile === 1 ? 0 : 5,
          },
        ]}
      >
        {/* {==================== Image & Title =======================} */}
        <Image
          style={[
            styles.imageStyle,
            {
              aspectRatio: ImageRatio && ImageRatio !== 0 ? ImageRatio : 1,
              borderWidth: 1,
              //   borderStyle: 'solid',
              borderColor: '#F6F6F8',
              borderRadius: 4,
            },
          ]}
          resizeMode="contain"
          source={{
            uri: `https:${uri}`,
          }}
        />
        {rowData?.widgets?.length > 1 ? (
          item?.title ? (
            <Text numberOfLines={2} style={[styles.categoryImageItemLabel]}>
              {item?.title}
            </Text>
          ) : (
            <View style={{ height: 5 }} />
          )
        ) : null}
      </TouchableOpacity>
    </>
  );
};
