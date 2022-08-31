import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { deviceWidth } from '../../constants/theme';
import Block from '../Block';
import Text from '../Text';
import { CategoryImageItem } from './CategoryImageItem';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import DownArrow from '../../../assets/svg/DownArrow.svg';
import StyleSheetFactory from './CategoriesImageGridStyle';
import { useSelector } from 'react-redux';

export const CategoriesImageGrid = ({
  rowData,
  navigation,
  flatlistLayoutWidth,
  isCategorieScreen,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  useEffect(() => {
    if (index < 2) {
      setExpanded(true);
    }
  }, []);

  return (
    <Block>
      <Collapse
        isExpanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
      >
        {/* {==================== ImageGrid Title =======================} */}

        <CollapseHeader>
          {rowData?.title ? (
            <Block
              style={[
                styles.collapseHeaderContainer,
                expanded
                  ? styles.collapseHeaderContainerExpanded
                  : styles.collapseHeaderContainerNotExpanded,
              ]}
            >
              <Block>
                {rowData?.title ? (
                  <Block style={styles.ImageScrollerMainViewStyle}>
                    <Text style={styles.ImageScrollerTitleTextStyle}>
                      {rowData?.title}
                    </Text>
                  </Block>
                ) : null}
              </Block>

              <Block
                flex={false}
                style={[
                  styles.collapseHeaderArrow,
                  expanded ? styles.collapseHeaderArrowRotate : {},
                ]}
              >
                <DownArrow height={10} width={10} />
              </Block>
            </Block>
          ) : (
            <View />
          )}
        </CollapseHeader>

        <CollapseBody>
          <View style={styles.collapseBodyContainer}>
            {rowData?.widgets?.map((item, index) => {
              let ImageRatio =
                item?.mobile_media?.fields?.file?.details?.image?.width /
                item?.mobile_media?.fields?.file?.details?.image?.height;

              const uri =
                item?.mobile_media?.fields?.file?.url ||
                item?.media?.fields?.file?.url;
              return (
                <CategoryImageItem
                  key={index + item?.widgetName}
                  rowData={rowData}
                  item={item}
                  navigation={navigation}
                  flatlistLayoutWidth={flatlistLayoutWidth}
                  isCategorieScreen={isCategorieScreen}
                />
              );
            })}
          </View>
        </CollapseBody>
      </Collapse>
    </Block>
  );
};
