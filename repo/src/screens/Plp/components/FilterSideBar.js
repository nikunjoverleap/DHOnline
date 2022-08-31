import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { deviceWidth } from '../../../constants/theme';
import Block from '../../../components/Block';
import StyleSheetFactory from '../PlpStyle';
import { useSelector, useDispatch } from 'react-redux';

export const FilterSideBar = ({
  facets = [],
  selectedFacet,
  onSelect = () => {},
  componentData,
}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  return (
    <View style={styles.PlpFilterSideBarContainer}>
      <FlatList
        data={facets}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          let selectedItems = [];
          if (item?.type === 'checkbox') {
            selectedItems = item?.values?.filter((val) => {
              return val.selected === true;
            });
          } else if (item?.type === 'radio') {
            selectedItems = item?.ranges?.filter((val) => {
              return val.selected === true;
            });
          } else if (item?.type === 'slider') {
            if (item?.slider?.selectedMax && item?.slider?.selectedMin) {
              selectedItems = [
                {
                  title: `${componentData?.currency} ${item?.slider?.selectedMin} - ${componentData?.currency} ${item?.slider?.selectedMax}`,
                  selected: true,
                },
              ];
            }
          }

          return (
            <View style={styles.PlpFilterSideBarItemContainer} key={index}>
              <TouchableOpacity onPress={() => onSelect(item)}>
                <Block
                  middle
                  flex={false}
                  color={
                    selectedFacet?.facet === item.facet ? '#FFFFFF' : '#F7F8FA'
                  }
                  width={deviceWidth * 0.35}
                  padding={[15, 5]}
                  borderBottomWidth={1}
                  borderColor={
                    selectedFacet?.facet === item.facet ? '#fff' : '#fff'
                  }
                >
                  {/* Further Sub Categories Name */}
                  <Text
                    style={[
                      styles.PlpFilterSideBarLabel,
                      {
                        color:
                          selectedFacet?.facet === item.facet
                            ? '#333333'
                            : '#333333',
                      },
                    ]}
                  >
                    {item.facetLabel}
                  </Text>
                  {selectedItems?.length > 0 ? (
                    <Text style={styles.PlpFilterSideBarSelectedItemsLabel}>
                      {selectedItems?.map((value, index) => {
                        return (
                          value?.selected &&
                          `${value.title}${
                            index !== selectedItems?.length - 1 ? ', ' : ''
                          }`
                        );
                      })}
                    </Text>
                  ) : null}
                </Block>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
