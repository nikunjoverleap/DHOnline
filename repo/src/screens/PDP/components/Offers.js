import React from 'react';
import { Text } from 'react-native';
import Block from '../../../components/Block';

export const Offers = () => {
  return (
    <Block
      width={'100%'}
      center
      padding={10}
      flex={false}
      color={'#FBF7EA'}
      margin={[15, 0, 0, 0]}
      style={{ borderColor: '#F3DDBE',borderWidth:1 }}
    >
      <Block flex={false} width={'95%'}>
        <Block flex={false} padding={[0, 10, 0, 0]} row center>
          <Block
            flex={false}
            center
            padding={8}
            width={'8%'}
            margin={[0, 10, 0, 0]}
            color={'red'}
            middle
          >
            {/* 243,221,190 */}
            <Text>I</Text>
          </Block>
          <Block flex={false}>
            <Text style={{ color: '#000', fontSize: 15 }}>
              Use coupon code{' '}
              <Text style={{ fontWeight: 'bold' }}>DANUBE20 </Text>
              at checkout & Get Extra 10% off
            </Text>
          </Block>
        </Block>
        <Text style={{ fontSize: 10, alignSelf: 'flex-end', color: '#000' }}>
          T&C Apply
        </Text>
      </Block>
    </Block>
  );
};
