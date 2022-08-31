import React, { useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useSelector, useDispatch } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';

import { deviceWidth } from '../../../constants/theme';
import Block from '../../../components/Block';
import StyleSheetFactory from '../PlpStyle';
import { FacetCheckBox } from './FacetCheckBox';

export const FilterContent = ({
  facet = {},
  selectedFacet = '',
  onFilterChange = () => {},
  configData,
  componentData,
}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const [contentFilter, setContentFilter] = useState({});
  const [facetValues, setFacetValues] = useState(facet?.values || []);
  const [selectedPriceRange, setSelectedPriceRange] = useState([
    facet?.slider?.selectedMin,
    facet?.slider?.selectedMax,
  ]);

  const [selectedDiscount, setSelectedDiscount] = useState({});

  const handleFilterContentChange = ({ item, isSelected }) => {
    if (facet.type === 'checkbox') {
      const newFacetValues = [...facetValues];
      const foundIndex = newFacetValues.findIndex(
        (facet) => item.title === facet.title
      );
      const newItem = { ...newFacetValues[foundIndex] };
      newItem.selected = isSelected;
      newFacetValues[foundIndex] = newItem;
      setFacetValues(newFacetValues);
      onFilterChange({
        filterFacet: facet,
        item: { ...item, values: newFacetValues },
      });
    } else if (facet.type === 'slider') {
      setSelectedPriceRange(item);
      onFilterChange({
        filterFacet: facet,
        item: {
          ...facet,
          slider: {
            ...facet.slider,
            selectedMin: item?.[0],
            selectedMax: item?.[1],
          },
        },
      });
    } else if (facet.type === 'radio') {
      setSelectedDiscount({ ...item, selected: true });
      const newFacetRanges = [...facet.ranges];

      const foundIndex = newFacetRanges.findIndex(
        (facet) => item.title === facet.title
      );

      newFacetRanges[foundIndex] = { ...item, selected: true };

      onFilterChange({
        filterFacet: facet,
        item: {
          ...facet,
          ranges: { ...item, values: newFacetRanges },
        },
      });
    }
  };

  useEffect(() => {
    setFacetValues(facet?.values);
  }, [facet?.values]);

  useEffect(() => {
    setSelectedPriceRange([
      facet?.slider?.selectedMin || facet?.slider?.min,
      facet?.slider?.selectedMax || facet?.slider?.max,
    ]);
  }, [facet?.slider]);

  useEffect(() => {
    facet?.ranges?.map((range) => {
      if (range?.selected) {
        setSelectedDiscount(range);
      }
    });
  }, [facet?.ranges]);

  const CustomSliderMarkerLeft = () => {
    return (
      <ElevatedView elevation={2} style={styles.CustomSliderMarkerLeftContaner}>
        <View
          style={[
            styles.CustomSliderLeftMarkerLabelContainer,
            {
              right:
                selectedPriceRange[0] / facet?.slider?.max > 0.27 ? 0 : -45,
            },
          ]}
        >
          <Text style={styles.CustomSliderLeftMarkerLabel}>
            {`${componentData.currency} ${selectedPriceRange[0]}`}
          </Text>
        </View>
        <View style={styles.CustomSliderLeftMarkerLabelDownArrow}></View>
      </ElevatedView>
    );
  };

  const CustomSliderMarkerRight = () => {
    return (
      <ElevatedView
        elevation={2}
        style={[styles.CustomSliderMarkerRightContaner]}
      >
        <View
          style={[
            styles.CustomSliderRightMarkerLabelContainer,
            {
              left: selectedPriceRange[1] / facet?.slider?.max < 0.82 ? 0 : -45,
            },
          ]}
        >
          <Text style={styles.CustomSliderRightMarkerLabel}>
            {`${componentData.currency} ${selectedPriceRange[1]}`}
          </Text>
        </View>
        <View style={styles.CustomSliderRightMarkerLabelDownArrow}></View>
      </ElevatedView>
    );
  };

  return (
    <Block flex={false}>
      {facet.type === 'checkbox' ? (
        <FlatList
          data={facetValues}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <FacetCheckBox
                type={facet.type}
                facet={facet}
                item={item}
                onCheckboxChange={handleFilterContentChange}
                configData={configData}
              />
            );
          }}
          keyExtractor={(item, index) => `${facet.key}_${item.title}`}
          ListFooterComponent={() => <View />}
          ListFooterComponentStyle={{
            height: 180,
          }}
          contentContainerStyle={{
            paddingTop: 15,
            paddingBottom: 15,
          }}
        />
      ) : facet.type === 'slider' ? (
        <>
          <View
            style={{
              marginLeft: 24,
              marginRight: 24,
              marginBottom: 12,
              marginTop: 50,
              position: 'relative',
            }}
          >
            <MultiSlider
              min={facet?.slider?.min}
              max={facet?.slider?.max}
              sliderLength={Dimensions.get('window').width * 0.65 - 48}
              isMarkersSeparated={true}
              onValuesChangeFinish={(values) => {
                handleFilterContentChange({ item: values });
              }}
              values={[
                facet?.slider?.selectedMin || facet?.slider?.min,
                facet?.slider?.selectedMax || facet?.slider?.max,
              ]}
              showSteps={true}
              selectedStyle={{
                backgroundColor: '#333333',
              }}
              unselectedStyle={{
                backgroundColor: '#F6F6F8',
              }}
              trackStyle={{
                height: 3,
              }}
              containerStyle={{}}
              enableLabel={false}
              customMarkerLeft={(e) => {
                return <CustomSliderMarkerLeft currentValue={e.currentValue} />;
              }}
              customMarkerRight={(e) => {
                return (
                  <CustomSliderMarkerRight currentValue={e.currentValue} />
                );
              }}
            />
          </View>
          <View style={styles.LimitRangeRow}>
            <View>
              <Text
                style={styles.LimitRangeLabel}
              >{`${componentData.currency} ${facet?.slider?.min}`}</Text>
            </View>
            <View>
              <Text
                style={styles.LimitRangeLabel}
              >{`${componentData.currency} ${facet?.slider?.max}`}</Text>
            </View>
          </View>
        </>
      ) : facet.type === 'radio' ? (
        <FlatList
          data={facet?.ranges}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View style={{ paddingTop: 7 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    handleFilterContentChange({
                      item: { ...item, selected: true },
                    });
                  }}
                >
                  <View style={styles.SortItem}>
                    <View
                      style={[
                        styles.SortItemRadioBtn,
                        item?.selected ||
                        (item?.title === selectedDiscount?.title &&
                          selectedDiscount?.selected)
                          ? styles.SortItemRadioBtnChecked
                          : {},
                      ]}
                    ></View>
                    <View>
                      <Text style={styles.SortItemLabel}>{item?.title}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item, index) => `${facet.key}_${item.title}`}
          ListFooterComponent={() => <View />}
          ListFooterComponentStyle={{
            height: 180,
          }}
          contentContainerStyle={{
            paddingLeft: 12,
            paddingRight: 12,
          }}
        />
      ) : null}
    </Block>
  );
};
