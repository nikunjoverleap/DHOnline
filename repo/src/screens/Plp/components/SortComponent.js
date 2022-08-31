import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import StyleSheetFactory from '../PlpStyle';

export const SortComponent = (props) => {
  const { language } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const {
    sortOptions,
    onApplySort,
    closeSortPopup,
    selectedSortOption,
    sortTitle,
  } = props;
  // const [selectedSortOption, setSelectedSortOption] =
  //   useState(selectedSortOption);

  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <View style={styles.SortHeader}>
        <Text style={styles.SortTitle}>{sortTitle}</Text>
      </View>

      <View style={styles.SortBody}>
        {sortOptions?.map((item, index) => {
          return (
            <View style={{ paddingTop: 15 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // setSelectedSortOption(item?.value);
                  onApplySort(item?.value);
                  closeSortPopup();
                }}
                key={index}
              >
                <View style={styles.SortItem}>
                  <View
                    style={[
                      styles.SortItemRadioBtn,
                      item?.value?.key === selectedSortOption?.key &&
                      item?.value?.order === selectedSortOption?.order
                        ? styles.SortItemRadioBtnChecked
                        : {},
                    ]}
                  ></View>
                  <View>
                    <Text style={styles.SortItemLabel}>{item?.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};
