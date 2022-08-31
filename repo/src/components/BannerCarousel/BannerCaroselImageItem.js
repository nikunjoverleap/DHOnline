import React, { useEffect } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Analytics_Events, logInfo } from '../../helper/Global';
import { targetToNewUrl } from '../../helper/url';
import { setPromotionClicks } from '../../slicers/analytic/analyticSlice';
import { setWebViewVisible } from '../../slicers/auth/authSlice';
import Block from '../Block';
import StyleSheetFactory from './BannerCarouselStyle';
import { handleNavigateToPlp } from '../../utils/product';
import FastImage from 'react-native-fast-image';
import { env } from '../../src/config/env';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const { width } = Dimensions.get('window');
const bannerItemImageWidth = Math.ceil(width) + 20;
export const BannerCaroselImageItem = ({
  style,
  bannerItem,
  row_index,
  widget_index,

  screen_name,
}) => {
  const navigation = useNavigation();
  const uri = React.useRef(
    bannerItem?.mobile_media?.fields?.file?.url ||
      bannerItem?.media?.fields?.file?.url
  );

  const { promotionClicks } = useSelector((state) => state.analytic);
  const dispatch = useDispatch();

  let styles = StyleSheetFactory.getSheet();
  const { country = 'en', language } = useSelector((state) => state.auth);

  const onPressBanner = () => {
    let customData = {
      creative_name: bannerItem?.creativeNameForTracking,
      promotion_id: bannerItem?.mobile_media?.sys?.id,
      promotion_name: bannerItem?.widgetName,
      creative_slot: `slot${row_index}_${widget_index}`,
      location_id: screen_name,
      // country,
      // language,
    };

    let checkIdAlreadyExists = promotionClicks?.find(
      (el) => el === bannerItem?.mobile_media?.sys?.id
    );

    if (!checkIdAlreadyExists) {
      dispatch(
        setPromotionClicks([
          ...promotionClicks,
          bannerItem?.mobile_media?.sys?.id,
        ])
      );

      Analytics_Events({
        eventName: 'Promotion_Clicks',
        params: customData,
        EventToken: '5rqy34',
      });
    }

    if (bannerItem?.targetType === 'external') {
      Linking.canOpenURL(bannerItem?.targetLink).then((supported) => {
        if (supported) {
          //  Linking.openURL(bannerItem?.targetLink);
          InAppBrowser.open(bannerItem?.targetLink);
        } else {
          logInfo("Don't know how to open URI: " + bannerItem?.targetLink);
        }
      });
    } else {
      if (bannerItem?.targetMode === 'PLP') {
        handleNavigateToPlp({
          navigation,
          plpCategoryId: bannerItem?.targetLink,
          plpCategoryName: bannerItem?.title,
          creativeName: bannerItem?.creativeNameForTracking,
          widgetName: bannerItem?.widgetName,
          previous_screen: screen_name,
        });
      } else if (bannerItem?.targetMode === 'PDP') {
        navigation.navigate('PDP', {
          url:
            `${env.BASE_URL}${country}/${language === 'ae_en' ? 'en' : 'ar'}/` +
            bannerItem?.targetLink,
        });
      } else if (bannerItem?.targetMode === 'Landing Page') {
        navigation.navigate('LandingPage', {
          pageId: item?.targetLink,
          creativeName: item?.creativeNameForTracking,
          widgetName: item?.widgetName,
        });
      } else {
        handleNavigateToPlp({
          navigation,
          plpCategoryId: bannerItem?.targetLink,
          plpCategoryName: bannerItem?.title,
          creativeName: bannerItem?.creativeNameForTracking,
          widgetName: bannerItem?.widgetName,
          previous_screen: screen_name,
        });
      }
    }
  };

  return (
    <Block style={[styles.imageContainer, style]}>
      <ActivityIndicator size="small" />
      <TouchableWithoutFeedback
        onPress={() => {
          onPressBanner();
          // dispatch(
          //   setWebViewVisible({
          //     webviewAppUrl: targetToNewUrl({
          //       relativeUrl: bannerItem.targetLink,
          //       country,
          //       language,
          //     }),
          //     webViewVisibility: true,
          //   })
          // );
        }}
      >
        <FastImage
          style={styles.img}
          source={{
            uri: `https:${uri.current}?w=${bannerItemImageWidth}`,

            priority: FastImage.priority.normal,
          }}
          //  resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
    </Block>
  );
};
