import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StyleSheetFactory from './PlpStyle';
import { useSelector } from 'react-redux';
import EmptyPlpSvg from '../../../assets/svg/EmptyPlp.svg';
import { SCREEN_NAME_HOME } from '../../constants';
import { useNavigation } from '@react-navigation/native';

export default EmptyWishlist = ({ componentData }) => {
  const navigation = useNavigation();
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  return (
    <View style={styles.emptyPlp}>
      <View style={styles.emptyPlpIcon}>
        <EmptyPlpSvg width={240} height={240} />
      </View>
      <View>
        <Text style={styles.emptyPlpTitle}>{componentData?.weAreSorry}</Text>
        <Text style={styles.emptyPlpDesc}>
          {componentData?.productNotFound}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('App');
        }}
      >
        <View style={styles.continueShoppingBtn}>
          <Text style={styles.continueShoppingBtnLabel}>
            {componentData?.backToHomeBtnLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
