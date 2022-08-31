import React, { useEffect, useState } from 'react';

import StyleSheetFactory from '../PlpStyle';
import { useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export const FacetCheckBox = ({
  facet = {},
  item = {},
  onCheckboxChange = () => {},
  configData,
}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  const handleCheck = () => {
    onCheckboxChange({ facet, item, isSelected: !!!item.selected });
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handleCheck()}>
      <View
        style={[
          styles.FacetCheckBoxContainer,
          facet?.facet === 'color'
            ? [
                styles.FacetCheckBoxContainerForColor,
                { borderColor: item.selected ? '#333333' : '#707070' },
              ]
            : styles.FacetCheckBoxContainerForNormal,
        ]}
      >
        <View
          style={[
            styles.FacetCheckBox,
            {
              backgroundColor:
                facet?.facet === 'color'
                  ? configData[item?.title]
                  : item.selected
                  ? '#333333'
                  : '#ffffff',
              borderColor:
                facet?.facet === 'color'
                  ? configData[item?.title]
                  : item.selected
                  ? '#333333'
                  : '#707070',
            },
          ]}
        >
          {item.selected ? <Icon name="check" size={15} color="#fff" /> : null}
        </View>
        <View>
          <Text numberOfLines={1} style={styles.FacetCheckBoxLabel}>
            {item.title} ({item.count})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
