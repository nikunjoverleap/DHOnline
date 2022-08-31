import React, { useState, useRef } from 'react';
import {
  SearchBase,
  SearchComponent,
  SearchBox,
} from '@appbaseio/react-native-searchbox';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';

const renderResultItem = ({ item }) => {
  return (
    <View style={styles.itemStyle}>
      <Image
        style={styles.image}
        source={{
          uri: item.image,
        }}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.textStyle}>{item.original_title}</Text>
        <Text style={styles.textStyle}>by {item.authors}</Text>
        <View style={styles.star}>
          {Array(item.average_rating_rounded)
            .fill('x')
            .map((i, index) => (
              <AntDesign
                key={item._id + `_${index}`}
                name="star"
                size={24}
                color="gold"
              />
            ))}
          <Text style={styles.rating}>({item.average_rating} avg)</Text>
        </View>
        <Text>Pub {item.original_publication_year}</Text>
      </View>
    </View>
  );
};

const renderItemSeparator = () => {
  return (
    // Flat List Item Separator
    <View style={styles.itemSeparator} />
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SearchBase
        index="dh_en_all"
        credentials="08Te2UKYo:09867f42-66b0-410e-8858-56bb8a21a5bd"
        url="https://straight-student-xajakhv-arc.searchbase.io"
        appbaseConfig={{
          recordAnalytics: true,
          enableQueryRules: true,
          userId: 'jon3@appbase.io',
          customEvents: {
            platform: 'ios',
            device: 'iphoneX',
          },
        }}
      >
        <SearchBox
          id="search-component"
          dataField={[
            {
              field: 'categoryLevel1',
              weight: 10,
            },
            {
              field: 'categoryLevel2',
              weight: 9,
            },
            {
              field: 'categoryLevel3',
              weight: 8,
            },
          ]}
          highlight
          categoryField="categoryLevel1"
          renderItem={(item) => {
            return <Text>{item.label}</Text>;
          }}
          renderNoSuggestion={() => <Text>No suggestions found</Text>}
          // autosuggest={false}
          enableRecentSearches
          // showAutoFill={false}
          // enablePopularSuggestions
          goBackIcon={(props) => <Ionicons {...props} />}
          autoFillIcon={(props) => <Feather name="arrow-up-left" {...props} />}
          recentSearchIcon={(props) => (
            <MaterialIcons name="history" {...props} />
          )}
          searchBarProps={{
            // platform: 'android'
            searchIcon: (props) => <MaterialIcons name="search" {...props} />,
            clearIcon: (props) => <MaterialIcons name="clear" {...props} />,
          }}
        />
        {/* <SearchComponent
          id="result-component"
          dataField="categoryLevel1"
          size={10}
          react={{
            and: ['search-component', 'author-filter'],
          }}
          preserveResults
        >
          {({ results, loading, size, from, setValue, setFrom }) => {
            return (
              <View>
                {loading && !results.data.length ? (
                  <ActivityIndicator
                    style={styles.loader}
                    size="large"
                    color="#000"
                  />
                ) : (
                  <View>
                    {!results.data.length ? (
                      <Text style={styles.resultStats}>No results found</Text>
                    ) : (
                      <View style={styles.resultContainer}>
                        <Text style={styles.resultStats}>
                          {results.numberOfResults} results found in{' '}
                          {results.time}ms
                        </Text>
                        <FlatList
                          data={results.data}
                          keyboardShouldPersistTaps={'handled'}
                          keyExtractor={(item) => item._id}
                          ItemSeparatorComponent={renderItemSeparator}
                          renderItem={renderResultItem}
                          onEndReached={() => {
                            const offset = (from || 0) + size;
                            if (results.numberOfResults > offset) {
                              setFrom((from || 0) + size);
                            }
                          }}
                          onEndReachedThreshold={0.5}
                          ListFooterComponent={
                            loading ? (
                              <ActivityIndicator size="large" color="#000" />
                            ) : null
                          }
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          }}
        </SearchComponent> */}
      </SearchBase>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loader: {
    marginTop: 50,
  },
  itemSeparator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  image: {
    width: 100,
    marginRight: 10,
  },
  itemStyle: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    height: 170,
  },
  star: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  textStyle: {
    flexWrap: 'wrap',
    paddingBottom: 5,
  },
  resultStats: {
    padding: 10,
  },
  rating: {
    marginLeft: 10,
  },
});
