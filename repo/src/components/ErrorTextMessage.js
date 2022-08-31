import React from 'react';
import Text from './Text';

export const ErrorTextMesage = ({ color, containerStyle, errorMessage }) => {
  return (
    <Text
      size={10}
      color={color ? color : '#DD1B28'}
      style={[{ width: '100%' }, containerStyle]}
    >
      {errorMessage}
    </Text>
  );
};
