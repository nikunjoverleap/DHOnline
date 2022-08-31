import React from 'react';
import Block from '../Block';
import Text from '../Text';

export const NewProductTag = ({ value }) => {
  return (
    <Block
      style={{
        position: 'absolute',
        height: 27,
        width: 55,
        top: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>{value}</Text>
    </Block>
  );
};
