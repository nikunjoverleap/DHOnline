import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '../constants/theme';
import Block from './Block';

export const Loader = ({ size, color }) => {
  return (
    <Block center style={{ justifyContent: 'center' }}>
      <ActivityIndicator
        size={size ? size : 'large'}
        color={color ? color : colors?.appThemeColor?.red}
      />
    </Block>
  );
};
