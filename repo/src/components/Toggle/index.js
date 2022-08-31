import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';

const Toggle = ({ onPress = () => {}, currentState = false }) => {
  return (
    <TouchableOpacity
      style={styles.main}
      onPress={() => {
        onPress();
      }}
      activeOpacity={0.6}
    >
      <View style={currentState ? styles.off : styles.on} />
    </TouchableOpacity>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  main: {
    width: 35,
    height: 19,
    borderWidth: 1,
    borderRadius: 9,
    justifyContent: 'center',
    padding: 2,
  },
  on: {
    alignSelf: 'flex-end',
    backgroundColor: colors.black,
    width: 19,
    height: 13,
    borderRadius: 9,
  },
  off: {
    borderWidth: 1,
    width: 19,
    height: 13,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
});
