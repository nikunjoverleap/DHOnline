import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Tab, TabView } from 'react-native-easy-tabs';
import { useSelector } from 'react-redux';
import { SCREEN_NAME_MY_CART } from '../../../constants';
import { MY_CART_CROSS_SELL_WIDGET } from '../constants';
import colors from '../../../styles/colors';
import DataList from '../../Plp/DataList';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import Seperator from '../../../components/Seperator';

const selectedFilters = [];
export const CrossSellWidgets = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const { country } = useSelector((state) => state.auth);
  const [crossSellCategories, setCrossSellCategories] = useState([]);
  const { screenSettings } = useSelector((state) => state.screens);
  const myCartData = screenSettings?.[SCREEN_NAME_MY_CART]?.components;
  const windowWidth = Dimensions.get('window').width;

  const crossSellConfig = myCartData?.[MY_CART_CROSS_SELL_WIDGET]?.config;
  const widgetLabels = myCartData?.[MY_CART_CROSS_SELL_WIDGET]?.componentData;
  useEffect(() => {
    if (cartItems?.cartData?.items?.length) {
      const crossSellCategories = [];
      cartItems?.cartData?.items?.forEach((item) => {
        if (item.product?.categories?.[2]?.name) {
          crossSellCategories.push(item.product?.categories?.[2]?.name);
        }
      });
      setCrossSellCategories(crossSellCategories);
    }

    //cartItems.
  }, [cartItems]);

  const layout = useWindowDimensions();

  const [carouselTabs, setTabs] = useState([]);
  useEffect(() => {
    if (crossSellCategories.length) {
      const tabs = [];

      const categories = crossSellConfig?.countries?.[country];
      crossSellCategories.map((cat) => {
        if (categories?.[cat]?.tabs) {
          tabs.push(...categories?.[cat]?.tabs);
        }
      });
      setTabs(
        tabs.map((tab) => ({
          key: tab.title,
          title: tab.title,
          plpCategoryId: tab.plpCategoryId,
        }))
      );
    }
  }, [crossSellCategories]);

  return (
    <>
      {carouselTabs?.length > 0 ? (
        <View style={styles.main}>
          <DanubeText
            style={{ marginVertical: 22 }}
            color={colors.black_3}
            variant={TextVariants.M}
          >
            {widgetLabels?.header || ''}
          </DanubeText>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.scrollView}
          >
            {carouselTabs.map((tab, index) => {
              const selected = currentTab === index;
              return (
                <TouchableOpacity
                  onPress={() => setCurrentTab(index)}
                  style={[
                    styles.tabBarItemStyle,
                    selected ? styles.selected : styles.unselected,
                  ]}
                >
                  <DanubeText
                    color={selected ? colors.white : colors.black}
                    variant={TextVariants.XXS}
                  >
                    {tab.title}
                  </DanubeText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={{}}>
            <TabView
              selectedTabIndex={currentTab}
              layoutWidth={windowWidth - 28}
            >
              {carouselTabs.map((tab, index) => {
                return (
                  <Tab key={tab.title} lazy>
                    <View style={styles.container}>
                      <DataList
                        plpCategoryId={carouselTabs?.[index].plpCategoryId}
                        numColumns={10}
                        initialPageSize={10}
                        selectedFilters={selectedFilters}
                        horizontal
                      />
                    </View>
                  </Tab>
                );
              })}
            </TabView>
          </View>
          <Seperator extraStyle={{ backgroundColor: '#F6F6F8', height: 13 }} />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  main: {
    marginBottom: 30,
    marginHorizontal: 14,
  },
  scrollView: {},
  padding: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  container: {},
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tabBarStyle: {
    height: 100,
  },
  tabBarItemStyle: {
    margin: 5,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  screenView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.black_5,
    borderRadius: 4,
  },
  unselected: {
    borderWidth: 1,
    borderColor: colors.black_5,
    borderRadius: 4,
  },
});
