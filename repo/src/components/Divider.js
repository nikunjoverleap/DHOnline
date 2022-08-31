import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Block from './Block';

export const Divider = ({ ExtraStyle }) => {
  return <Block flex={false} style={[styles.dividerView, ExtraStyle]}></Block>;
};

const styles = StyleSheet.create({
  dividerView: {
    width: '100%',
    height: 1,
    backgroundColor: '#E1E1E1',
    marginVertical: 10,
  },
});
