import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';

const Seperator = ({ extraStyle, bold }) => {
  return (
    <View style={[styles.seperator, extraStyle, bold ? styles.bold : {}]} />
  );
};

export default Seperator;

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: colors.grey_3,
    height: 1,
    zIndex: 0,
  },
  bold: {
    backgroundColor: '#F6F6F8',
    height: 13,
  },
});
