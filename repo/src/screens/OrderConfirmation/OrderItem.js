import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import StyleSheetFactory from './OrderConfirmationStyle';

export default OrderItem = ({ navigation, item, componentData }) => {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  return (
    <View style={styles.orderItemContainer}>
      <View style={styles.itemImg}>
        <View style={styles.itemImg}>
          <Image
            style={styles.itemImg}
            resizeMode="contain"
            source={{
              uri: item?.thumbnail,
            }}
          />
        </View>
      </View>
      <View style={styles.orderItemRightSection}>
        <View>
          <Text style={styles.productName}>{item?.name}</Text>
        </View>
        <View>
          {/* <Text style={styles.saveLabel}>You Saved AED 796</Text> */}
        </View>
        <View>
          <Text style={styles.productQty}>
            {componentData?.qty} - {item?.qty}
          </Text>
        </View>
        <View>
          <Text style={styles.currencyLabel}>
            {componentData?.currency}{' '}
            <Text style={styles.nowPriceLabel}>{item?.price} </Text>
            {/* <Text style={styles.wasPrice}>AED 3,555</Text> */}
          </Text>
        </View>
      </View>
    </View>
  );
};
