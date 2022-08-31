import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Block from '../../../components/Block';
import Text from '../../../components/Text';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../../constants';

function ProductPatternsList({ productData }) {
  const [selectedPatternIndex, setSelectedPatternIndex] = useState(1);
  const patternsListItem = [
    {
      id: 1,
      image: productData?.thumbnail?.url,
      PatternName: 'Solid Wood',
      isAvailable: true,
    },
    {
      id: 2,
      image: productData?.thumbnail?.url,
      PatternName: 'Hardwood',
      isAvailable: false,
    },
    {
      id: 3,
      image: productData?.thumbnail?.url,
      PatternName: 'Laminate',
      isAvailable: true,
    },
    {
      id: 4,
      image: productData?.thumbnail?.url,
      PatternName: 'Vinyl Plank',
      isAvailable: true,
    },
  ];

  const renderPatternsImageList = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedPatternIndex(item?.id);
        }}
        disabled={!item?.isAvailable}
      >
        <Block
          flex={false}
          style={[
            styles.patternMainView,
            {
              borderStyle: item?.isAvailable === false ? 'dashed' : 'solid',
              borderColor:
                selectedPatternIndex === item?.id ? 'red' : '#C4C4C4',
            },
          ]}
          center
          middle
        >
          <Block flex={false} width={30} height={30}>
            <Image style={[styles.imageStyle]} source={{ uri: item?.image }} />
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Block flex={false} padding={[10, 15]} color={'white'}>
      <Block flex={false} row>
        <Text style={styles.flooringPatternText}>Flooring Pattern : </Text>
        {patternsListItem?.map((data) => {
          return data?.id === selectedPatternIndex ? (
            <Text style={styles.patternNameText}>{data?.PatternName}</Text>
          ) : null;
        })}
      </Block>
      <FlatList
        data={patternsListItem}
        horizontal={true}
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => renderPatternsImageList(item, index)}
        keyExtractor={(item, index) => item.id}
      />
    </Block>
  );
}
export default ProductPatternsList;

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 2,
  },
  flooringPatternText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#000000',
  },
  patternNameText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#828282',
  },
  patternMainView: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 2,
    borderWidth: 2,
  },
});
