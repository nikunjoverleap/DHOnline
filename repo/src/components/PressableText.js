import React from 'react';
import { TouchableOpacity } from 'react-native';
import Block from './Block';
import Text from './Text';

export const PressableText = ({ textStyle, text, onPress, containerStyle }) => {
  return (
    <Block flex={false} padding={[0, 0, 0, 10]}>
      <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Text style={textStyle} size={12}>
          {text}
        </Text>
      </TouchableOpacity>
    </Block>
  );
};
