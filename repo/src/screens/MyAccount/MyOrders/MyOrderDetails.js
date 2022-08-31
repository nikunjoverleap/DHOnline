import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Block from '../../../components/Block';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import colors from '../../../styles/colors';
import CartHeader from '../../MyCart/components/CartHeader';
import CreditCard from '../../../../assets/svg/CreditCard.svg';

const MyOrderDetails = ({ navigation }) => {
  const UserDetails = ({ itemKey, itemValue }) => {
    return (
      <Block flex={false} margin={[5, 10]} padding={[0, 10]} row>
        <DanubeText variant={TextVariants.XS} regular style={{ width: '20%' }}>
          {itemKey}
        </DanubeText>
        <DanubeText
          variant={TextVariants.XS}
          regular
          style={{ flex: 1, marginLeft: 10 }}
        >
          {itemValue}
        </DanubeText>
      </Block>
    );
  };

  const OrderSummaryData = ({ itemKey, itemValue }) => {
    return (
      <Block
        flex={false}
        width={'100%'}
        margin={[3, 0]}
        padding={[0, 15]}
        row
        space={'between'}
      >
        <DanubeText variant={TextVariants.XS} regular style={{ flex: 1 }}>
          {itemKey}
        </DanubeText>
        <DanubeText variant={TextVariants.XS} regular right style={{ flex: 1 }}>
          {itemValue}
        </DanubeText>
      </Block>
    );
  };

  const Seperator = () => {
    return (
      <Block height={15} color={'#EBEBEB'} width={'100%'} margin={[10, 0]} />
    );
  };

  return (
    <Block flex={1} color={'white'}>
      <SafeAreaView style={styles.safearea} />
      <CartHeader
        isEmptyCartHeader={false}
        headerTitle={'Order Details'}
        label={'ORDER ID - 0000000000'}
        description={'Placed on June 10, 2022, 11.37 AM'}
        navigation={navigation}
        headerHeight={100}
      />
      <ScrollView style={{ backgroundColor: 'white' }}>
        <Block flex={false} margin={[10, 0, 0, 0]}>
          <Block
            flex={false}
            margin={[10]}
            padding={[10]}
            color={colors.white_2}
            row
          >
            <Block flex={false} height={20} width={20}>
              <Image
                source={require('../../../../assets/images/back.png')}
                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              />
            </Block>
            <DanubeText
              variant={TextVariants.S}
              bold
              style={{ marginLeft: 10 }}
            >
              Office
            </DanubeText>
          </Block>

          <UserDetails itemKey={'Name'} itemValue={'Akhil Kumar'} />
          <UserDetails
            itemKey={'Address'}
            itemValue={'Danube home, Jabel Ali Free Zone, Gate No 4 - Dubai'}
          />
          <UserDetails
            itemKey={'Mobile No.'}
            itemValue={'565555555 (Verified)'}
          />

          <Seperator />

          {/* Payment Method */}
          <Block flex={false} width={'100%'} padding={[0, 0, 10, 10]}>
            <Block flex={false} width={'100%'} padding={[10, 10]} row>
              <Block flex={false} height={20} width={20}>
                <CreditCard height={20} width={20} />
              </Block>
              <DanubeText
                variant={TextVariants.S}
                bold
                style={{ marginLeft: 10 }}
              >
                Payment Method
              </DanubeText>
            </Block>

            <DanubeText
              variant={TextVariants.XXS}
              regular
              style={{ marginLeft: 15 }}
            >
              Payfort - Credit / Debit Card
            </DanubeText>
          </Block>

          <Seperator />

          {/* Order Summary */}
          <Block flex={false} padding={[10, 0, 15, 15]}>
            <DanubeText variant={TextVariants.S} bold>
              ORDER SUMMARY
            </DanubeText>
          </Block>
          <OrderSummaryData itemKey={'Subtotal'} itemValue={'AED 174'} />
          <OrderSummaryData
            itemKey={'Shipping and Handling Fee'}
            itemValue={'AED 174'}
          />
          <OrderSummaryData itemKey={'Discount'} itemValue={'AED 174'} />
          <OrderSummaryData itemKey={'Cod Charge'} itemValue={'AED 174'} />
          
        </Block>
      </ScrollView>
    </Block>
  );
};

export default MyOrderDetails;
const styles = StyleSheet.create({
  safearea: {
    backgroundColor: colors.white_2,
  },
});
