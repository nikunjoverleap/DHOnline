import { View, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../../../styles/colors';

const Top = () => {
  return (
    <View style={styles.main}>
      <View style={styles.inner} />
    </View>
  );
};

export default Top;

const styles = StyleSheet.create({
  main: {
    height: 40,
    marginTop: 19,
  },
  inner: {
    height: 300,
    backgroundColor: colors.white,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
});
