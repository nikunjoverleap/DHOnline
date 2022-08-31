import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
  SCREEN_NAME_PLP,
} from '../../../constants';
import { PLP_FILTER_AND_SORT_BAR } from '../constants';
import { Filter } from './Filter';
import FilterSvg from '../../../../assets/svg/Filter.svg';
import SortSvg from '../../../../assets/svg/Sort.svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SortComponent } from './SortComponent';
import Close from '../../../../assets/svg/CloseBlackIcon.svg';

import StyleSheetFactory from '../PlpStyle';
import { Badge } from 'react-native-paper';

export const FilterAndSortBar = ({
  plpCategoryId,
  onApplyFilter,
  preSelectedFilters = [],
  onApplySort,
  selectedSortOption,
  query,
}) => {
  const { language } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const refRBSheetSort = useRef();
  const refRBSheetFilter = useRef();
  const { screenSettings } = useSelector((state) => state.screens);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const plpScreenSettings = screenSettings?.[SCREEN_NAME_PLP];
  const componentData =
    plpScreenSettings?.components[PLP_FILTER_AND_SORT_BAR]?.componentData;
  const configData =
    plpScreenSettings?.components[PLP_FILTER_AND_SORT_BAR]?.config;
  const handleApplyFilter = (newFilters) => {
    setShowFilterModal(!showFilterModal);
    onApplyFilter(newFilters);
  };

  const SortCloseBtn = (action) => {
    return (
      <View style={styles.CloseBtn}>
        <View style={{ padding: 7 }}>
          <TouchableOpacity onPress={() => closeSortPopup()}>
            <Close height={13} width={13} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const closeSortPopup = () => {
    //TODO Add Click event
    refRBSheetSort.current.close();
  };

  const closeFilterPopup = () => {
    //TODO Add Click event
    refRBSheetFilter.current.close();
  };

  useEffect(() => {
    onApplySort(componentData?.sortOptions[0]?.value);
  }, [componentData]);

  const RenderSortPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetSort}
        closeOnDragDown={false}
        closeOnPressMask={true}
        shouldMeasureContentHeight={true}
        onClose={() => {}}
        customStyles={{
          wrapper: {
            backgroundColor: '#000000B3',
          },
          container: styles.ModalContainer,
        }}
        animationType="fade"
      >
        <View>
          <SortComponent
            sortOptions={componentData?.sortOptions}
            onApplySort={onApplySort}
            closeSortPopup={closeSortPopup}
            selectedSortOption={selectedSortOption}
            sortTitle={componentData?.sortTitle}
          />
          <SortCloseBtn />
        </View>
      </RBSheet>
    );
  };

  const RenderFilterPopup = () => {
    return (
      <RBSheet
        ref={refRBSheetFilter}
        closeOnDragDown={false}
        closeOnPressMask={true}
        shouldMeasureContentHeight={false}
        customStyles={{
          wrapper: {
            backgroundColor: '#000000B3',
          },
          container: [
            styles.ModalContainer,
            { height: Dimensions.get('window').height },
          ],
        }}
        animationType="fade"
      >
        <>
          <Filter
            preSelectedFilters={preSelectedFilters}
            plpCategoryId={plpCategoryId}
            onApplyFilter={handleApplyFilter}
            closeFilterPopup={closeFilterPopup}
            configData={configData}
            query={query}
          />
        </>
      </RBSheet>
    );
  };

  return (
    <>
      <RenderSortPopup />
      <RenderFilterPopup />

      <View style={styles.filterAndSortBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => refRBSheetSort.current.open()}
        >
          <View style={styles.filterAndSortBarItem}>
            <View style={styles.filterAndSortBarItemIcon}>
              <SortSvg height={18} width={15} />
            </View>
            <View>
              <Text style={styles.filterAndSortBarItemLabel}>
                {componentData?.sortTitle}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.filterAndSortBarItemDivider} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            refRBSheetFilter.current.open();
          }}
        >
          <View style={styles.filterAndSortBarItem}>
            <View style={styles.filterAndSortBarItemIcon}>
              <FilterSvg height={18} width={15} />
              {preSelectedFilters?.length ? (
                <Badge
                  size={16}
                  style={{
                    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                    backgroundColor: '#D12E27',
                    position: 'absolute',
                    left: 5,
                    bottom: 10,
                  }}
                >
                  {preSelectedFilters?.length}
                </Badge>
              ) : null}
            </View>
            <View>
              <Text style={styles.filterAndSortBarItemLabel}>
                {componentData?.filterTitle}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
