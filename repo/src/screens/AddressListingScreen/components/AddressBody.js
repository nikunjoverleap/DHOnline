import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DanubeText from '../../../components/DanubeText';
import colors from '../../../styles/colors';
import AddressFooter from './AddressFooter';
import AddressType from './AddressType';

const AddressBody = ({
  extraStyle,
  name,
  address,
  mobileNo,
  isDefault,
  addressType,
  navigation,
  onSelect,
  editButton,
  deleteButton,
  defaultAddressSelected,
  index,
  isClickAndCollect,
  editAddressID,
  item,
  length,
  underline = true,
  flatNumber = '',
}) => {
  const selected = defaultAddressSelected === index;
  return (
    <TouchableOpacity
      style={[styles.main, selected && styles.isDefault, extraStyle]}
      onPress={onSelect}
      activeOpacity={0.6}
    >
      {addressType ? (
        <AddressType isDefault={isDefault} addressType={addressType} />
      ) : null}
      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <DanubeText style={styles.left}>Name</DanubeText>
          <DanubeText style={styles.name} mediumText>
            {name}
          </DanubeText>
        </View>
        <View style={styles.row}>
          <DanubeText style={styles.left}>
            {isClickAndCollect ? 'Email' : 'Address'}
          </DanubeText>
          <DanubeText style={styles.right}>
            {flatNumber}
            {flatNumber ? ',' : ''}
            {address}
          </DanubeText>
        </View>
        <View style={styles.row}>
          <DanubeText style={styles.left}>Mobile No.</DanubeText>
          <DanubeText style={styles.right}>{mobileNo}</DanubeText>
        </View>
        <AddressFooter
          deleteButton={!isDefault && deleteButton}
          editButton={editButton}
          buttonLabel={'Edit'}
          onEditPress={() => {
            navigation.navigate('AddressInput', {
              isEditAddress: true,
              editAddressID,
              item,
            });
          }}
        />
      </View>
      {selected || length - 1 === index || underline === false ? null : (
        <View style={styles.underline}></View>
      )}
    </TouchableOpacity>
  );
};

export default AddressBody;

const styles = StyleSheet.create({
  main: {},
  isDefault: {
    borderColor: colors.light_green,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.light_green,
    borderWidth: 1.5,
  },

  header: {
    flexDirection: 'row',
    backgroundColor: colors.grey_10,
    paddingVertical: 13,
  },

  icon: {
    marginLeft: 13,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 5,
    paddingRight: 1,
  },
  right: {
    flex: 3,
    fontSize: 13,
  },
  left: {
    flex: 1,
    fontSize: 11,
  },
  name: {
    fontSize: 16,
    flex: 3,
  },
  rowContainer: {
    paddingTop: 4,
    paddingBottom: 17,
  },
  underline: {
    height: 1,
    backgroundColor: colors.grey_9,
  },
});

AddressBody.propTypes = {
  extraStyle: PropTypes.object,
  editButton: PropTypes.bool,
  deleteButton: PropTypes.bool,
};
AddressBody.defaultProps = {
  extraStyle: {},
  deleteButton: false,
  editButton: false,
  name: '',
  address: '',
  mobileNo: '',
};
