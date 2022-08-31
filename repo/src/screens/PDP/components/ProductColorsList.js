import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  TouchableOpacity,
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

function ProductColorsList({
  navigation,
  components,
  productData,
  selectedColorItem,
  setSelectedcolorItem,
}) {
  const RendercolorsImageList = ({ item, index }) => {
    let uri = item?.media_gallery?.[0]?.value;
    let newReplaceURI = uri.replace('/pub', '');
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedcolorItem(item);
        }}
      >
        <Block
          flex={false}
          style={[
            styles.colorsImageView,
            {
              borderColor: '#C4C4C4',
              borderWidth: selectedColorItem?._id === item?._id ? 1 : 1,
              borderStyle:
                selectedColorItem?._id === item?._id ? 'dashed' : 'solid',
            },
          ]}
          center
          middle
        >
          <Block flex={false} width={54} height={54}>
            <Image
              style={[styles.imageStyle]}
              source={{
                uri: `https:${newReplaceURI}?w=100`,
              }}
            />
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Block flex={false} padding={[10, 15]} color={'white'}>
      <Block flex={false} row>
        <Text style={styles.colorText}>
          {
            productData?.getProductDetailForMobile?.relatedProducts?.[0]
              ?.related_base_label
          }{' '}
          -{' '}
        </Text>

        <Text style={styles.colorNameText}>
          {selectedColorItem?.base_value?.value}
        </Text>
      </Block>
      <FlatList
        data={productData?.getProductDetailForMobile?.relatedProducts}
        horizontal={true}
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <RendercolorsImageList item={item} index={index} />
        )}
        keyExtractor={(item, index) => item.id}
      />
    </Block>
  );
}
export default ProductColorsList;

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 3,
  },
  colorText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#000000',
  },
  colorNameText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#828282',
  },
  colorsImageView: {
    width: 60,
    height: 60,
    marginRight: 5,
    borderRadius: 5,
  },
});
