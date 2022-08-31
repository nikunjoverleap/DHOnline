import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StyleSheetFactory from './WishlistStyle';
import { useSelector } from 'react-redux';
import EmptyWishlistSvg from '../../../assets/svg/EmptyWishlist.svg';

export default EmptyWishlist = ({ navigation, componentData }) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  return (
    <View style={styles.emptyWishlist}>
      <View style={styles.emptyWishlistIcon}>
        <EmptyWishlistSvg width={240} height={240} />
      </View>
      <View>
        <Text style={styles.emptyWishlistTitle}>
          {componentData?.emptyScreenMsgTitle}
        </Text>
        <Text style={styles.emptyWishlistDesc}>
          {componentData?.emptyScreenMsgDesc}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('LandingPage', { pageId: 'UAE Furniture' });
        }}
      >
        <View style={styles.continueShoppingBtn}>
          <Text style={styles.continueShoppingBtnLabel}>
            {componentData?.continueShoppingBtnLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
