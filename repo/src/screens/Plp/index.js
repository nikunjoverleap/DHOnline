import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { EVENT_NAME_SCREEN_VIEW, SCREEN_NAME_PLP } from '../../constants';
import { Analytics_Events } from '../../helper/Global';

import { FilterAndSortBar } from './components/FilterAndSortBar';
import { PLP_DATA, PLP_FILTER_AND_SORT_BAR } from './constants';
import DataList from './DataList';
const RenderPLPComponents = ({
  name,
  components,
  plpCategoryId,
  query,
  selectedFilters,
  handleApplyFilter,
  navigation,
  selectedSortOption,
  handleApplySort,
}) => {
  switch (name) {
    case PLP_DATA: {
      const List = useMemo(() => {
        return (
          <DataList
            plpTFetchTimer
            plpCategoryId={plpCategoryId}
            query={query}
            selectedFilters={selectedFilters}
            navigation={navigation}
            selectedSortOption={selectedSortOption}
          />
        );
      }, [selectedFilters, selectedSortOption]);
      return List;
      // return (
      //   <DataList
      //     plpTFetchTimer
      //     plpCategoryId={plpCategoryId}
      //     query={query}
      //     selectedFilters={selectedFilters}
      //     navigation={navigation}
      //     selectedSortOption={selectedSortOption}
      //   />
      // );
    }
    case PLP_FILTER_AND_SORT_BAR:
      return (
        <>
          <FilterAndSortBar
            plpCategoryId={plpCategoryId}
            query={query}
            onApplyFilter={handleApplyFilter}
            preSelectedFilters={selectedFilters}
            onApplySort={handleApplySort}
            selectedSortOption={selectedSortOption}
          />
        </>
      );
    default:
      return null;
  }
};
function PlpScreen({ navigation, route = {} }) {
  const {
    plpCategoryId,
    query,
    previous_screen,
    landed_from_url,
    landed_from_push_notification,
    via,
    is_deferred_deeplink,
  } = route.params || {};
  const { screenSettings } = useSelector((state) => state.screens);
  const { country, language } = useSelector((state) => state.auth);

  const plpScreenSettings = screenSettings[SCREEN_NAME_PLP];
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState({
    key: '',
    order: '',
  });
  const handleApplyFilter = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  const handleApplySort = (option) => {
    setSelectedSortOption({ ...option });
  };

  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: SCREEN_NAME_PLP,
        country,
        language,

        previous_screen,

        is_deferred_deeplink,
        landed_from_url,
        via,
        landed_from_push_notification,
      },
      // EventToken: 'qbj2pa',
    });
  }, []);

  return (
    <View style={{ backgroundColor: '#fff' }}>
      {plpScreenSettings?.componentsOrder?.map((name) => {
        return (
          <>
            <RenderPLPComponents
              key={name}
              name={name}
              plpCategoryId={plpCategoryId}
              query={query}
              components={plpScreenSettings.components}
              selectedFilters={selectedFilters}
              handleApplyFilter={handleApplyFilter}
              navigation={navigation}
              selectedSortOption={selectedSortOption}
              handleApplySort={handleApplySort}
            />
          </>
        );
      })}
    </View>
  );
}
export default PlpScreen;
