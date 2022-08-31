import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import { useSelector } from 'react-redux';
import BackSvg from '../../../../assets/svg/BackArrow.svg';
import ShareSvg from '../../../../assets/svg/Share.svg';
import {
  EVENT_NAME_PDP_SHARE,
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_REGULAR,
} from '../../../constants';
import { Analytics_Events, rotateIcon } from '../../../helper/Global';
import { env } from '../../../src/config/env';
import colors from '../../../styles/colors';

function PDPHeader({ navigation, productName, urlKey, product }) {
  const { country, language } = useSelector((state) => state.auth);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: productName,
        url: `${env.BASE_URL}${country}/${language}/${urlKey}`,
      });
      Analytics_Events({
        eventName: EVENT_NAME_PDP_SHARE,
        params: {
          item_id: product._id,
          method: 'universal',
          content_type: 'url',
        },
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  return (
    <ElevatedView elevation={1} style={styles.margin}>
      <View style={styles.main}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.back, rotateIcon]}
        >
          <BackSvg height={18} width={15} />
        </TouchableOpacity>
        {/* Product Name */}
        <View style={styles.product}>
          <Text
            style={[
              styles.title,
              {
                fontFamily:
                  language === 'ar'
                    ? FONT_FAMILY_ARABIC_REGULAR
                    : FONT_FAMILY_ENGLISH_REGULAR,
              },
            ]}
            numberOfLines={2}
          >
            {productName}
          </Text>
        </View>
        {/* Share Icon */}
        <View style={styles.centered}>
          {urlKey ? (
            <TouchableOpacity
              style={[styles.headerRightButtonView]}
              onPress={() => onShare()}
            >
              <ShareSvg height={26} width={24} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerRightButtonView} />
          )}
        </View>
      </View>
    </ElevatedView>
  );
}
export default PDPHeader;

const styles = StyleSheet.create({
  headerLeftButtonView: {
    marginLeft: 5,
  },

  title: {
    fontSize: 20,
    color: '#0A0A0A',
    marginLeft: 10,
    paddingRight: 10,
    textAlign: 'left',
  },
  headerRightButtonView: {
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 21,
  },
  margin: {
    marginBottom: 1,
  },
  main: {
    flexDirection: 'row',
    padding: 5,
    minHeight: 65,
    backgroundColor: colors.white,
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 10,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
