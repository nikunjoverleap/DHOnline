import React, { useEffect, useState } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  Keyboard,
} from 'react-native';

import BackArrow from '../../../assets/svg/BackArrow.svg';
import CloseIcon from '../../../assets/svg/SearchClose.svg';
import Search from '../../../assets/svg/SearchInputIcon.svg';

import { Analytics_Events, logError, logInfo } from '../../helper/Global';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector } from 'react-redux';
import StyleSheetFactory from './SearchProductStyle';
import ElevatedView from 'react-native-elevated-view';
import { SCREEN_NAME_PLP, SCREEN_NAME_SEARCH } from '../../constants';
import { SEARCH_DATA } from './constants';
import { handleNavigateToPlp } from '../../utils/product';
import colors from '../../styles/colors';

import { getAutoSugggest } from './actions';

let searchTextTimer;

export default function SearchProduct({ navigation }) {
  const { language, country } = useSelector((state) => state.auth);
  const [searchListData, setSearchListData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [alreadySearchedProductsList, setAlreadySearchedProductsList] =
    useState([]);
  const { screenSettings } = useSelector((state) => state.screens);
  const plpScreenSettings = screenSettings?.[SCREEN_NAME_SEARCH];
  const componentData =
    plpScreenSettings?.components[SEARCH_DATA]?.componentData;
  let styles = StyleSheetFactory.getSheet(language, searchText);

  const getSearchProduct = async () => {
    clearTimeout(searchTextTimer);
    searchTextTimer = setTimeout(async () => {
      if (searchText) {
        const data = await getAutoSugggest({
          query: searchText,
          country,
          language,
        });

        setSearchListData(data);
      }
    }, 50);
  };
  useEffect(() => {
    getSearchProduct();
  }, [searchText]);

  useEffect(() => {
    Analytics_Events({
      eventName: 'Screen_View',
      EventToken: 'qbj2pa',
      params: {
        country,
        language,
        screen_name: 'Suggest',
        items_shown: 'trending, mad red sale, recent sale',
      },
    });
  }, []);

  useEffect(() => {
    getSearchListDataFromAsyncStorage();
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      let entries = searchListData?.map((data) => {
        return data?.text;
      });
      Analytics_Events({
        eventName: 'Screen_View_Complete',
        EventToken: 'tpm40f',
        params: {
          country,
          language,
          content: 'Furniture',
          items_shown: entries?.join(','),
        },
      });
    }, 5000);
    return () => clearTimeout(timeOutId);
  }, [searchText]);

  {
    /* {==================== GetSearchData from AsyncStorage ======================} */
  }
  const getSearchListDataFromAsyncStorage = async () => {
    const value = await AsyncStorage.getItem('SEARCH_PRODUCT_LIST');
    setAlreadySearchedProductsList(JSON.parse(value));
  };

  {
    /* {==================== GetSearchData from api ======================} */
  }

  {
    /* {==================== onSelectSearchItem ======================} */
  }
  const onSelectSearchItem = async (text) => {
    // setSearchText(text);

    Analytics_Events({
      eventName: 'custom_click',
      params: {
        country,
        language,
        content: 'Furniture',
        cta: 'item',
      },
      EventToken: 'rj72e9',
    });

    navigation.navigate(SCREEN_NAME_PLP, {
      query: text,
      title: text,
    });

    if (!alreadySearchedProductsList?.includes(text)) {
      try {
        let customSearchListData = [];
        if (
          alreadySearchedProductsList &&
          alreadySearchedProductsList?.length < 10
        ) {
          customSearchListData = JSON.stringify([
            ...alreadySearchedProductsList,
            text,
          ]);
        } else {
          let custommmm = alreadySearchedProductsList
            ? alreadySearchedProductsList
            : [];
          custommmm.shift();
          customSearchListData = JSON.stringify([...custommmm, text]);
        }
        await AsyncStorage.setItem('SEARCH_PRODUCT_LIST', customSearchListData);

        getSearchListDataFromAsyncStorage();
      } catch (error) {
        logError(error, { where: 'customSearchListData ===> error ==>> ' });
      }
    } else {
      logInfo({
        where: 'customSearchListData ===> Already exist ==>> ',
      });
    }
  };

  const LineContainer = () => {
    return <View style={styles.lineStyle} />;
  };
  const dimen = useWindowDimensions();
  const [listHeight, setListHeight] = useState();
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', (e) => {
      logInfo('dimen', dimen, e);
      setListHeight(dimen.height - e.endCoordinates.height - 175);
    });
    Keyboard.addListener('keyboardDidHide', (e) => {
      logInfo('dimenHide', dimen, e);
      setListHeight(dimen.height - 50);
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ElevatedView elevation={1} style={styles.headerContainer}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.backIcon}>
              <BackArrow height={15} width={15} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputContainer}>
          <View>
            <TextInput
              autoFocus={true}
              placeholderTextColor={colors.grey_8}
              placeholder={componentData?.SearchPlaceholderTitle}
              style={styles.searchInputStyle}
              value={searchText}
              returnKeyType="search"
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={() => {
                onSelectSearchItem(searchText);
              }}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => setSearchText('')}>
              {searchText ? (
                <CloseIcon height={13} width={13} />
              ) : (
                <Search height={22} width={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ElevatedView>

      {/* {==================== SearchDataList ======================} */}
      <View>
        {searchListData?.length > 0 ? (
          <>
            {/* {==================== SearchDataList From Api ======================} */}
            <FlatList
              style={{ height: listHeight ? listHeight : dimen.height }}
              data={searchListData}
              contentContainerStyle={{
                backgroundColor: '#fff',
              }}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => onSelectSearchItem(item?.text)}
                    >
                      <View style={styles.searchResultItem}>
                        <Text style={styles.searchResultItemLabel}>
                          {item?.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <LineContainer />
                  </>
                );
              }}
            />
            {/* <View>
              <Text>
                {`${searchListData?.numberOfProducts}`} Matching Products
              </Text>
            </View> */}
          </>
        ) : (
          <View style={styles.searchSuggessionContainer}>
            {componentData?.suggesions[country]?.map((suggesion) => {
              return (
                <View style={styles.searchSuggessionSection}>
                  <View style={styles.searchSuggessionTitleContainer}>
                    <Text style={styles.searchSuggessionTitle}>
                      {suggesion?.title}
                    </Text>
                  </View>
                  <View style={styles.searchSuggessionItemContainer}>
                    {suggesion?.items?.map((item) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (item?.targetLink) {
                              handleNavigateToPlp({
                                navigation,
                                plpCategoryId: item.targetLink,
                                plpCategoryName: item?.name,
                              });
                            } else {
                              onSelectSearchItem(item?.name);
                            }
                          }}
                        >
                          <View style={styles.searchSuggessionItem}>
                            <Text>{item?.name}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// alreadySearchedProductsList ? (
//   <>
//     {/* {==================== SearchDataList From AsyncStorage ======================} */}
//     <FlatList
//       data={alreadySearchedProductsList}
//       contentContainerStyle={{
//         backgroundColor: '#fff',
//       }}
//       renderItem={({ item }) => {
//         return (
//           <>
//             <TouchableOpacity
//               onPress={() => onSelectSearchItem(item)}
//               style={styles.autosuggestTextViewStyle}
//             >
//               <View style={styles.autoSuggestItem}>
//                 <Text style={styles.autoSuggestItemLabel}>{item}</Text>
//               </View>
//             </TouchableOpacity>
//             <LineContainer />
//           </>
//         );
//       }}
//     />
//   </>
// ) : null}
