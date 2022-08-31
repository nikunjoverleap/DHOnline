import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { deviceWidth } from '../../constants/theme';
import Block from '../Block';
import Text from '../Text';

export const TopTabBar = ({
  selectTabs,
  selectedCategorieData,
  onselectCategorie = () => {},
}) => {
  return (
    <FlatList
      data={selectTabs}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <Block flex={true}>
            <TouchableOpacity onPress={() => onselectCategorie(item)}>
              <Block
                margin={[0, 4]}
                center
                middle
                flex={false}
                color={
                  selectedCategorieData?.tabTitle === item.tabTitle
                    ? '#e01c30'
                    : '#fafafa'
                }
                radius={6}
                width={deviceWidth * 0.27}
                padding={[15, 5]}
              >
                {/* Further Sub Categories Name */}
                <Text
                  center
                  style={{
                    fontSize: 11,
                    fontFamily: 'Roboto-Bold',
                    color:
                      selectedCategorieData?.tabTitle === item.tabTitle
                        ? 'white'
                        : 'black',
                  }}
                >
                  {' '}
                  {item.tabTitle}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};
