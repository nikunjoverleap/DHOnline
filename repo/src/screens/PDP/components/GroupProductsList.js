import isEmpty from 'lodash.isempty';
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '../../../components/Block';
import Text from '../../../components/Text';
import { GroupProductItem } from './GroupProductItem';

function GroupProductsList({
  components,
  productData,
  productArray = () => {},
}) {
  const { language } = useSelector((state) => state.auth);
  const [productDataArray, setProductDataArray] = useState([]);

  useEffect(() => {
    setProductDataArray(productData);
  }, [productData]);

  return (
    <>
      {!isEmpty(productDataArray) && (
        <Block
          flex={false}
          padding={[0, 10, 10, 10]}
          color={'white'}
          margin={[0, 0, 0, 0]}
        >
          <Text numberOfLines={2} style={styles.title}>
            {components?.componentData?.title}
          </Text>
          <FlatList
            horizontal={true}
            data={productDataArray}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            style={language === 'ar' ? { flexDirection: 'row-reverse' } : {}}
            renderItem={({ item, index }) => {
              return (
                <GroupProductItem
                  item={item}
                  index={index}
                  groupProduct={productDataArray}
                  productArray={(data) => productArray(data)}
                />
              );
            }}
          />
        </Block>
      )}
    </>
  );
}
export default GroupProductsList;

const styles = StyleSheet.create({
  title: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginHorizontal: 5,
    marginVertical: 15,
  },
});
