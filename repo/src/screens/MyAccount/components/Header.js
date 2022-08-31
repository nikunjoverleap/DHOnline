import { View, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import React from 'react';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import BackArrow from '../../../../assets/svg/arrow-back.svg';
import colors from '../../../styles/colors';
import { rotateIcon } from '../../../helper/Global';

const Header = ({ navigation, label }) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.button, rotateIcon]}
      >
        <BackArrow width={18} height={18} color={colors.black} />
      </TouchableOpacity>
      <DanubeText variant={TextVariants.M} mediumText color={colors.black}>
        {label}
      </DanubeText>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 66,
  },
  button: {
    position: 'absolute',
    left: 22,
  },
});
