import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { arrowLeft } from '../../utils/common';

export default function SimpleHeader({ onPress = () => {} }) {
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={onPress} style={styles.arrow}>
        {arrowLeft}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: 35,
    marginLeft: 25,
    justifyContent: 'center',
  },
  arrow: {
    width: 20,
  },
});
