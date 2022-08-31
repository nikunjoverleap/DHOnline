import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Block from '../../../../components/Block';
import DanubeText, { TextVariants } from '../../../../components/DanubeText';
import colors from '../../../../styles/colors';

const MyOrderList = ({ item, index, navigation, myOrders }) => {
  return (
    <Block flex={false}>
      <Block
        flex={false}
        borderColor={'lightgray'}
        style={{ borderWidth: 1 }}
        radius={5}
        width={'95%'}
        selfcenter
        padding={[0, 0]}
        margin={[20, 0]}
      >
        <Block
          row
          width={'100%'}
          color={colors.white_2}
          space={'between'}
          padding={[10]}
        >
          <Block>
            <DanubeText variant={TextVariants.S} mediumText>
              ORDER ID - 0000000000
            </DanubeText>
            <DanubeText variant={TextVariants.XXS} regular>
              Placed on June 10, 2022
            </DanubeText>
          </Block>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyOrderDetails')}
            style={{
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 5,
            }}
          >
            <Text>View Details</Text>
          </TouchableOpacity>
        </Block>

        <FlatList
          data={myOrders}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <Block
                flex={false}
                margin={[10, 0, 10, 0]}
                padding={[0, 0, 0, 10]}
                row
                center
              >
                <Block
                  flex={false}
                  height={100}
                  width={100}
                  color={colors.white_2}
                ></Block>
                <Block flex={false} padding={[0, 10, 0, 10]} width={250}>
                  <DanubeText
                    variant={TextVariants.S}
                    mediumText
                    numberOfLines={1}
                  >
                    Burlington 1-Seater Fabr...dsdsd
                  </DanubeText>
                  <DanubeText
                    variant={TextVariants.XXS}
                    regular
                    style={{ marginTop: 5 }}
                  >
                    Placed on June 10, 2022
                  </DanubeText>
                  <DanubeText
                    variant={TextVariants.XXS}
                    regular
                    style={{ marginTop: 5 }}
                  >
                    Status - Cancelled
                  </DanubeText>
                </Block>
              </Block>
            );
          }}
        />
      </Block>
      {myOrders?.length - 1 !== index ? (
        <Block
          style={{
            height: 10,
            backgroundColor: '#EBEBEB',
            width: '100%',
          }}
        ></Block>
      ) : null}
    </Block>
  );
};

export default MyOrderList;
const styles = StyleSheet.create({});
