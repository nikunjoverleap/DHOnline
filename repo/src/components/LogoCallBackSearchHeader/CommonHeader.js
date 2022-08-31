import * as React from 'react';
import { Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StyleSheetFactory from './LogoCallBackSearchHeaderStyle';
import CustomerCare from '../../../assets/svg/CustomerCare.svg';
import Search from '../../../assets/svg/Search.svg';
import { colors } from '../../constants/theme';
import { useSelector } from 'react-redux';
import Block from '../Block';

function CommonHeader({
  navigation,
  onPressCustomerCare,
  onPressBack = () => {},
}) {
  let styles = StyleSheetFactory.getSheet();

  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <Block flex={false} style={styles.container}>
        {/* { =================== Header logo =================== } */}
        <Block flex={false}>
          <TouchableOpacity onPress={onPressBack}>
            <Text style={{ paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>
        </Block>

        <Block flex={false} style={styles.leftContainer}>
          {/* { =================== Call Back Button =================== } */}
          <Block flex={false}>
            <TouchableOpacity onPress={onPressCustomerCare} style={styles.btn}>
              <Block flex={false}>
                <CustomerCare height={17} width={17} />
              </Block>
              <Block flex={false}>
                <Text style={styles.btnLabel}>Call Back</Text>
              </Block>
            </TouchableOpacity>
          </Block>

          {/* { =================== Search Button =================== } */}
          <Block flex={false}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SearchProduct');
              }}
              style={styles.btn}
            >
              <Block flex={false}>
                <Search height={17} width={17} />
              </Block>
              <Block flex={false}>
                <Text style={styles.btnLabel}>Search</Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </SafeAreaView>
  );
}
export default CommonHeader;
