import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SingleSidedShadowBox from '../../../components/SingleSidedShadowBox';
import { rotateIcon } from '../../../helper/Global';

const CheckoutHeader = ({ mainIcon, backIcon, navigation }) => {
  return (
    <SingleSidedShadowBox>
      <View style={styles.main}>
        <View>{mainIcon}</View>
        <TouchableOpacity
          style={[styles.back, rotateIcon]}
          onPress={() => navigation.goBack()}
        >
          {backIcon}
        </TouchableOpacity>
      </View>
    </SingleSidedShadowBox>
  );
};

export default CheckoutHeader;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22.75,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 6,
  },
  back: {
    position: 'absolute',
    left: 8,
    padding: 16,
  },
});
