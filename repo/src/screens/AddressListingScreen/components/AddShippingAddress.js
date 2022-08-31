import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PlusIcon from '../../../../assets/svg/plusIcon.svg';

import DanubeText from '../../../components/DanubeText';
import colors from '../../../styles/colors';

const AddShippingAddress = ({ extraStyle, onAddButtonPress }) => {
  return (
    <View style={{ backgroundColor: colors.white }}>
      <View style={[styles.main, extraStyle]}>
        <TouchableOpacity
          style={styles.dashed}
          onPress={() => onAddButtonPress()}
          activeOpacity={0.6}
        >
          <View style={styles.plus}>
            <PlusIcon />
          </View>
          <DanubeText>Add Your Shipping Address</DanubeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddShippingAddress;

const styles = StyleSheet.create({
  dashed: {
    minHeight: 109,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.grey_4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  plus: {
    marginRight: 9,
  },
  main: {
    marginHorizontal: 14,
    backgroundColor: colors.white,
  },
});
