import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { deviceWidth } from '../../constants/theme';
import Block from '../Block';
import Text from '../Text';
import StyleSheetFactory from './SideTabBarStyle';
import { useSelector, useDispatch } from 'react-redux';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';

export const SideTabBar = ({
  selectTabs,
  selectedCategorieData,
  onselectCategorie = () => {},
}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const isArabic = language === 'ar';

  return (
    <Block
      flex={false}
      style={{
        backgroundColor: '#F6F6F8',
      }}
    >
      <FlatList
        data={selectTabs}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <Block style={{ maxWidth: '28%' }}>
              <TouchableOpacity onPress={() => onselectCategorie(item)}>
                <Block
                  left={!isArabic}
                  right={isArabic}
                  middle
                  flex={false}
                  color={
                    selectedCategorieData?.tabTitle === item.tabTitle
                      ? '#ffffff'
                      : '#F6F6F8'
                  }
                  width={deviceWidth * 0.27}
                  padding={[16, 5]}
                  borderBottomWidth={1}
                  borderColor={
                    selectedCategorieData?.tabTitle === item.tabTitle
                      ? '#fff'
                      : '#fff'
                  }
                >
                  {/* Further Sub Categories Name */}
                  <Text
                    left={!isArabic}
                    right={isArabic}
                    style={{
                      fontSize: 14,
                      textAlign: 'left',
                      fontFamily: isArabic
                        ? FONT_FAMILY_ARABIC_REGULAR
                        : FONT_FAMILY_ENGLISH_REGULAR,
                      color: '#333333',
                    }}
                  >
                    {' '}
                    {item.title}
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </Block>
  );
};
