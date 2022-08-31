import React from 'react';
import Block from '../Block';
import Text from '../Text';
import RotateIcon from '../../../assets/svg/RotateIcon.svg';
import { TouchableOpacity } from 'react-native';

export const Three60View = ({ handle360Button }) => {
  return (
    <TouchableOpacity
      onPress={handle360Button}
      style={{
        position: 'absolute',
        height: 50,
        width: 50,
        top: 10,
        right: 10,
        borderRadius: 25,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Block flex={false} width={25} height={25}>
        <RotateIcon width={'100%'} height={'100%'} />
      </Block>
      <Text style={{ fontSize: 12 }}>360°</Text>
    </TouchableOpacity>
  );
};
