import React from 'react';
import { Text } from 'react-native';
import Block from '../../../components/Block';

export const ClickAndCollect = () => {
  return (
    <Block width={'100%'} center padding={[10]} flex={false} color={'#333333'} margin={[15,0,0,0]}>
      <Block flex={false} width={'95%'}>
        <Block flex={false} margin={[0, 10, 0, 0]} row center>
          <Block
            flex={false}
            center
            width={'8%'}
            padding={8}
            middle
            margin={[0, 10, 0, 0]}
            color={'red'}
          >
            <Text>I</Text>
          </Block>
          <Text style={{ color: '#fff', fontSize: 15 }}>
            This Product available on Click & Collect
          </Text>
        </Block>
        <Text style={{ fontSize: 10, alignSelf: 'flex-end', color: '#fff' }}>
          T&C Apply
        </Text>
      </Block>
    </Block>
  );
};
