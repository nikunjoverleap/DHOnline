import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SCREEN_NAME_PLP } from '../../../constants';
import { getProductList } from '../actions';
import { PLP_FILTER_AND_SORT_BAR } from '../constants';
import { FilterSideBar } from './FilterSideBar';
import { FilterContent } from './FilterContent';
import StyleSheetFactory from '../PlpStyle';
import ElevatedView from 'react-native-elevated-view';
import BackSvg from '../../../../assets/svg/BackArrow.svg';

export const Filter = ({
  plpCategoryId,
  onApplyFilter,
  query,
  preSelectedFilters = [],
  closeFilterPopup,
  configData,
}) => {
  const { country, language } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const { screenSettings } = useSelector((state) => state.screens);
  const plpScreenSettings = screenSettings?.[SCREEN_NAME_PLP];
  const [selectedFacet, setSelectedFilterTab] = useState();
  const [selectedFilters, setSelectedFilters] = useState(preSelectedFilters);
  const [totalProducts, setTotalProducts] = useState(0);
  const componentData =
    plpScreenSettings?.components[PLP_FILTER_AND_SORT_BAR]?.componentData;

  const dispatch = useDispatch();
  const [facets, setFacets] = useState([]);
  const fetchProducts = async () => {
    const data = await getProductList(
      {
        store: { country, language },
        categoryId: plpCategoryId,
        pageSize: 0,
        pageOffset: 0,
        showFacets: true,
        query,
        filters: selectedFilters,
      },
      dispatch
    );
    setFacets([...(data?.list?.facets || [])]);
    setTotalProducts(data?.list.totalProducts);
    if (selectedFacet?.facet) {
      setSelectedFilterTab(
        data?.list?.facets?.find(
          (facet) => facet.facet === selectedFacet?.facet
        )
      );
    } else if (data?.list?.facets?.[0]) {
      setSelectedFilterTab(data?.list?.facets?.[0]);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedFilters]);

  useEffect(() => {
    setSelectedFilters(preSelectedFilters);
  }, [preSelectedFilters]);

  const handleFilterTabSelect = (item) => {
    setSelectedFilterTab(item);
  };

  const handleFilterChange = ({ filterFacet, item }) => {
    const newSelectedFilters = [...selectedFilters];
    const foundIndex = newSelectedFilters.findIndex(
      (filterItem) => filterItem?.[filterFacet.facet]
    );
    let foundItem = newSelectedFilters?.[foundIndex];

    if (filterFacet.type === 'checkbox') {
      const newFacetItemValue = {
        [filterFacet?.facet]: {
          in: item?.values?.filter((it) => it.selected).map((it) => it.title),
        },
      };
      if (!foundItem) {
        foundItem = newFacetItemValue;
      } else {
        foundItem = { ...foundItem, ...newFacetItemValue };
      }
      if (foundIndex > -1) newSelectedFilters[foundIndex] = foundItem;
      else newSelectedFilters.push(foundItem);
    } else if (filterFacet.type === 'slider') {
      const newFacetItemValue = {
        [filterFacet?.facet]: {
          min: item?.slider.selectedMin,
          max: item?.slider.selectedMax,
          type: 'range',
        },
      };

      if (foundIndex > -1) newSelectedFilters[foundIndex] = newFacetItemValue;
      else newSelectedFilters.push(newFacetItemValue);
    } else if (filterFacet.type === 'radio') {
      const newFacetItemValue = {
        [filterFacet?.facet]: {
          min: item?.ranges?.gte,
          max: item?.ranges?.lte,
          type: 'range',
        },
      };
      if (foundIndex > -1) newSelectedFilters[foundIndex] = newFacetItemValue;
      else newSelectedFilters.push(newFacetItemValue);
    }
    setSelectedFilters(newSelectedFilters);
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedFilters);
  };

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <ElevatedView elevation={1} style={styles.FilterHeader}>
        <View style={styles.FilterHeaderLeftSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => closeFilterPopup()}
          >
            <View style={styles.FilterHeaderBackBtn}>
              <BackSvg height={15} width={15} />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.FilterHeaderLabel}>
              {componentData?.filterTitle}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => closeFilterPopup()}
        >
          <View style={styles.FilterCancelBtn}>
            <Text style={styles.FilterCancelBtnLabel}>
              {componentData?.cancelLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </ElevatedView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 1,
        }}
      >
        <FilterSideBar
          facets={facets}
          onSelect={handleFilterTabSelect}
          selectedFacet={selectedFacet}
          componentData={componentData}
        />
        <FilterContent
          margin={[10, 0, 0, 0]}
          facet={selectedFacet}
          onFilterChange={handleFilterChange}
          configData={configData}
          componentData={componentData}
        />
      </View>

      <ElevatedView elevation={5} style={[styles.FilterFooter]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectedFilters([]);
            onApplyFilter([]);
          }}
        >
          <View style={styles.FilterResetBtn}>
            <Text style={styles.FilterResetBtnLabel}>
              {componentData?.resetBtnLabel}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={handleApplyFilter}>
          <View style={styles.FilterApplyBtn}>
            <View>
              <Text style={styles.FilterApplyBtnItemsLabel}>
                {totalProducts} {componentData?.itemsLabel}
              </Text>
            </View>
            <View>
              <Text style={styles.FilterApplyBtnLabel}>
                {componentData?.applyBtnLabel}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ElevatedView>
    </View>
  );
};
