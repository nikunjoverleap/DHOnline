import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Block from '../Block';
import StyleSheetFactory from './ProductDetailCarouselStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import Close from '../../../assets/svg/CloseBlackIcon.svg';

export const ProductDetailsCarouselImageItem = ({
  style,
  productDetailItem,
  product,
  index,
}) => {
  const uri = productDetailItem?.value;
  const newReplaceURI = uri.replace('/pub', '');
  let styles = StyleSheetFactory.getSheet();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const images = [];

  product?.map((item, index) => {
    let img = {
      url: `https:${item?.value?.replace('/pub', '')}`,
      index: index,
    };
    images?.push(img);
  });

  return (
    <>
      <Modal visible={isModalVisible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          index={index}
          renderFooter={() => {
            return (
              <View
                style={{
                  width: Dimensions.get('window')?.width,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 50,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#fff6',
                      padding: 15,
                      borderRadius: 50,
                    }}
                  >
                    <Close height={20} width={20} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </Modal>
      <Block style={[styles.imageContainer, style]}>
        <ActivityIndicator size="small" />
        <View style={{ height: '100%', width: '100%', position: 'absolute' }}>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(!isModalVisible);
            }}
            activeOpacity={1}
          >
            <Image
              resizeMode={'contain'}
              style={styles.img}
              source={{
                uri: `https:${newReplaceURI}`,
              }}
            />
          </TouchableOpacity>
        </View>
      </Block>
    </>
  );
};
