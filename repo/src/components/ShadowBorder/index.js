import React from 'react';
import { StyleSheet, View } from 'react-native';

const ShadowBorder = () => {
  return <View style={styles.shadow} />;
};

export default ShadowBorder;

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: '#E9E9E9',
    elevation: 1,
    height: 1,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: -3,
    },
  },
});
