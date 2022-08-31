import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Block from '../../../components/Block';
import colors from '../../../styles/colors';
import EmptyScreen from '../../EmptyScreen';
import CartHeader from '../../MyCart/components/CartHeader';
import MyOrderList from './components/MyOrderList';

function MyOrders({ navigation }) {
  const [myOrders, setMyOrders] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  return myOrders.length > 0 ? (
    <Block flex={1} color={'white'}>
      <SafeAreaView style={styles.safearea} />
      <CartHeader
        isEmptyCartHeader={false}
        headerTitle={'Orders'}
        label={'View Your Order Details'}
        navigation={navigation}
      />

      <Block flex={1} color={'white'}>
        <FlatList
          data={myOrders}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MyOrderList
              item={item}
              index={index}
              navigation={navigation}
              myOrders={myOrders}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </Block>
    </Block>
  ) : (
    <Block flex={1} color={'white'}>
      <SafeAreaView style={styles.safearea} />
      <EmptyScreen
        navigation={navigation}
        headerComponent={
          <CartHeader
            isEmptyCartHeader={false}
            headerTitle={'Order Details'}
            label={'Your Order is Empty'}
            navigation={navigation}
          />
        }
        buttonLabel={'CONTINUE SHOPPING'}
        title="No Order History"
        description="No history of transactions made on danubehome"
        // imageUri={'../../../assets/images/back.png'}
      />
      <SafeAreaView />
    </Block>
  );
}
export default MyOrders;

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: colors.white_2,
  },
});
