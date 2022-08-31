import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StyleSheetFactory from './PdpStyle';
import { useSelector } from 'react-redux';
import EmptyPlpSvg from '../../../assets/svg/EmptyPlp.svg';
import { useNavigation } from '@react-navigation/native';

export default EmptyPdp = ({}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const navigation = useNavigation();

  return (
    <View style={styles.emptyPdp}>
      <View style={styles.emptyPdpIcon}>
        <EmptyPlpSvg width={240} height={240} />
      </View>
      <View>
        <Text style={styles.emptyPdpTitle}>We are Sorry !</Text>
        <Text style={styles.emptyPdpDesc}>Product no Found</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation?.navigate('Home');
        }}
      >
        <View style={styles.continueShoppingBtn}>
          <Text style={styles.continueShoppingBtnLabel}>BACK TO HOME</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
