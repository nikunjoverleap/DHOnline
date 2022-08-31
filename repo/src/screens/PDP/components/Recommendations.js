import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import DataList from '../../Plp/DataList';
import StyleSheetFactory from '../PdpStyle';
import { useSelector } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';

export const Recommendations = ({
  component,
  productData,
  disableRelatedProductVariant = false,
}) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);
  const { componentData, config } = component;

  const [isShowWidget, setIsShowWidget] = useState(true);

  showWidgetHandler = () => {
    setIsShowWidget(false);
  };

  const List = useMemo(
    () => (
      <DataList
        disableRelatedProductVariant={disableRelatedProductVariant}
        plpTFetchTimer
        plpCategoryId=""
        numColumns={10}
        initialPageSize={6}
        selectedFilters={config?.filters}
        horizontal
        productId={productData?._id}
        recommendationId={config?.recommendationId}
        userId=""
        type="recommendation"
        showWidgetHandler={showWidgetHandler}
      />
    ),
    [productData?._id]
  );

  return (
    <>
      {isShowWidget ? (
        <ElevatedView elevation={1} style={styles.recommendationContainer}>
          <View>
            <Text style={styles.recommendationTitle}>
              {componentData?.title}
            </Text>
          </View>
          {List}
        </ElevatedView>
      ) : null}
    </>
  );
};
