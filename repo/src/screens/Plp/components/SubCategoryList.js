import React from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import StyleSheetFactory from '../PlpStyle';
import { useSelector } from 'react-redux';
import { SCREEN_NAME_PLP } from '../../../constants';

export default SubCategoryList = ({ data, navigation }) => {
  const { language } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  return (
    <FlatList
      horizontal
      data={data}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{}}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (item?.target) {
                navigation.push(SCREEN_NAME_PLP, {
                  plpCategoryId: item?.target,
                  plpCategoryName: language && item?.title[language],
                });
              }
            }}
          >
            <View style={styles.SubCategoryItemContainer}>
              <View>
                <Image
                  style={styles.SubCategoryItemImg}
                  source={{
                    uri: item?.bannerLink,
                  }}
                />
              </View>
              <View>
                <Text numberOfLines={2} style={styles.SubCategoryName}>
                  {language && item?.title[language]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};
