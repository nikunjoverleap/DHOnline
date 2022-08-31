import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import ApolloClientContentService from '../../ApolloClientContentService';
import Block from '../../components/Block';
import LogoCallBackSearchHeader from '../../components/LogoCallBackSearchHeader';
import BannerCarousel from '../../components/BannerCarousel';
import { ImageScroller } from '../../components/ImageCarousel';
import { SideTabBar } from '../../components/TabBar/SideTabBar';
import { CategoriesImageGrid } from '../../components/ImageGrid/CategoriesImageGrid';
import { Loader } from '../../components/Loder';
import { useSelector } from 'react-redux';
import { CATEGORIES_PAGE_LIST } from '../../helper/gql/query';
import { getCountryData } from '../../helper/country';
import { Analytics_Events } from '../../helper/Global';
import {
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  FONT_FAMILY_ENGLISH_REGULAR,
  SCREEN_NAME_CATEGORY,
  SCREEN_NAME_HOME,
} from '../../constants';
import { useIsFocused } from '@react-navigation/native';

function CategoriesScreen({ navigation, route = {} }) {
  const {
    landed_from_url,
    via,
    landed_from_push_notification,
    is_deferred_deeplink = false,
    previous_screen,
  } = route.params || {};
  const isFocused = useIsFocused();
  const { language, country } = useSelector((state) => state.auth);
  const { screenSettings } = useSelector((state) => state.screens);
  const countryData = getCountryData({ country });
  const { loading, error, data } = useQuery(CATEGORIES_PAGE_LIST, {
    client: ApolloClientContentService,
    variables: {
      pageId: countryData?.categoryPageID
        ? countryData?.categoryPageID
        : 'UAE Category Page',
      locale: language === 'en' ? 'en-US' : 'ar',
    },
  });

  const [selectedCategorieData, setSelectedCategorieData] = useState({});

  const [flatlistLayoutWidth, setFlatlistLAyoutWidth] = useState(0);
  const { getPage = [] } = data || {};

  const { selectTabs = [] } = getPage?.[0] || [];

  useEffect(() => {
    selectDefaultTab();
  }, [selectTabs]);

  useEffect(() => {
    const { getPage = [] } = data || {};
    const selectRows = getPage?.[0]?.selectRows;
    const numberOfTabs = getPage?.[0]?.selectTabs;
    const pageName = getPage?.[0]?.pageName;

    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: 'Categories',
        country,
        language,
        page_name: pageName,

        landed_from_url,
        via,
        landed_from_push_notification,
        is_deferred_deeplink,
        previous_screen,
      },
      EventToken: 'qbj2pa',
    });

    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
      EventToken: 'tpm40f',
      params: {
        screen_name: 'Categories',
        country,
        language,
        page_name: pageName,
        promotional_page_name: '',
        number_of_tabs: numberOfTabs?.length,
        number_of_rows: selectRows?.length,
        number_of_image_grids: selectRows?.filter(
          (row) => row.type === 'ImageGrid'
        )?.length,
      },
    });
  }, []);

  const selectDefaultTab = () => {
    setSelectedCategorieData(selectTabs?.[0]);
  };

  const OnSelecteCategorie = (data) => {
    setSelectedCategorieData(data);
  };

  return (
    <Block style={{ flex: 1 }}>
      <Block flex={false} elevation={5}>
        <LogoCallBackSearchHeader
          navigation={navigation}
          onPressCustomerCare={() => {}}
          onPressSearchIcon={() => {
            navigation.navigate('SearchProduct');
            Analytics_Events({
              eventName: 'custom_click',
              EventToken: 'rj72e9',
              params: {
                country,
                language,
                cta: 'search_icon',
              },
            });
          }}
        />
      </Block>

      <Block>
        <Block row color={'white'}>
          {loading ? null : (
            <SideTabBar
              selectTabs={selectTabs}
              selectedCategorieData={selectedCategorieData}
              onselectCategorie={(data) => OnSelecteCategorie(data)}
            />
          )}
          <Block
            onLayout={(event) => {
              var { x, y, width, height } = event.nativeEvent.layout;
              setFlatlistLAyoutWidth(width);
            }}
          >
            <FlatList
              data={selectedCategorieData?.selectRows}
              style={{ flexGrow: 1, marginTop: 5, marginHorizontal: 5 }}
              // numColumns={3}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <Block style={{ width: flatlistLayoutWidth }}>
                    {/* {==================== BannerCarousel =====================} */}
                    {item?.type === 'BannerCarousel' ? (
                      <BannerCarousel
                        isCategorieScreen={true}
                        flatlistLayoutWidth={flatlistLayoutWidth}
                        banner={item}
                        navigation={navigation}
                        screen_name={SCREEN_NAME_CATEGORY}
                      />
                    ) : null}

                    {/* {==================== ImageScroller =====================} */}
                    {item?.type === 'ImageScroller' ? (
                      <ImageScroller
                        isCategorieScreen={true}
                        flatlistLayoutWidth={flatlistLayoutWidth}
                        rowData={item}
                        navigation={navigation}
                        screen_name={SCREEN_NAME_CATEGORY}
                      />
                    ) : null}

                    {/* {==================== ImageGrid =====================} */}
                    {item?.type === 'ImageGrid' ? (
                      <CategoriesImageGrid
                        rowData={item}
                        isCategorieScreen={true}
                        flatlistLayoutWidth={flatlistLayoutWidth}
                        navigation={navigation}
                        index={index}
                      />
                    ) : null}
                  </Block>
                );
              }}
            />
          </Block>
        </Block>
        {loading ? (
          <Block
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          >
            <Loader />
          </Block>
        ) : null}
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  ImageScrollerMainViewStyle: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  ImageScrollerTitleTextStyle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  marginTop15: { marginTop: 15 },
  imageItemContainerMainViewStyle: {
    paddingHorizontal: 5,
  },
  imageStyle: {
    flex: 1,
  },
  imageItemContainerTitleTextStyle: {
    marginBottom: 3,
    fontSize: 8,
    marginTop: 3,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});

export default CategoriesScreen;
