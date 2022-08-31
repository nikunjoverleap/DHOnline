import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Block from '../../../components/Block';
import Text from '../../../components/Text';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../../constants';

function ProductMattressSizeList({
  productData,
  selectedMattressSize,
  setSelectedMattressSize,
  navigation,
}) {
  // productData?.getProductDetailForMobile?.relatedProducts

  const renderMattressSizeList = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedMattressSize(item);
        }}
      >
        <Block
          flex={false}
          padding={[8, 10]}
          style={[
            styles.matteresSizeTextView,
            {
              borderStyle:
                selectedMattressSize?._id === item?._id ? 'solid' : 'dashed',
              borderColor: '#5E5E5E',
            },
          ]}
          center
          middle
        >
          <Text style={[styles.mattressSizeText, { color: '#333333' }]}>
            {item?.base_value?.value}
          </Text>
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Block flex={false} padding={[10, 15]} color={'white'}>
      <Block flex={false} row>
        <Text
          style={styles.mattressSizeText}
        >{`${productData?.getProductDetailForMobile?.relatedProducts?.[0]?.base_value?.key} : `}</Text>

        <Text style={styles.mattressSizeNameText}>
          {selectedMattressSize?.base_value?.value}
        </Text>
      </Block>
      <FlatList
        data={productData?.getProductDetailForMobile?.relatedProducts}
        horizontal={true}
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => renderMattressSizeList(item, index)}
        keyExtractor={(item, index) => item.id}
      />
    </Block>
  );
}
export default ProductMattressSizeList;

const styles = StyleSheet.create({
  mattressSizeText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#000000',
  },
  mattressSizeNameText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#828282',
  },
  matteresSizeTextView: {
    marginRight: 10,
    borderRadius: 4,

    borderColor: '#C4C4C4',
    borderWidth: 2,
  },
});
