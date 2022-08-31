import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomeLocation from '../../../../assets/svg/home_location.svg';
import DanubeText from '../../../components/DanubeText';
import colors from '../../../styles/colors';
import OfficeLocation from '../../../../assets/svg/office.svg';

const AddressType = ({ isDefault, addressType }) => {
  const addressTypeLabel = addressType === 1 ? 'Home' : 'Work';
  const addressTypeIcon =
    addressType === 1 ? <HomeLocation /> : <OfficeLocation />;
  return (
    <View style={[styles.header, isDefault ? styles.color : {}]}>
      <View style={styles.icon}>{addressTypeIcon}</View>
      <DanubeText style={styles.headrLabel} mediumText>
        {addressTypeLabel}
      </DanubeText>
      {isDefault ? (
        <View style={styles.defaultContainer}>
          <View style={styles.default}>
            <DanubeText style={styles.defaultText}>default</DanubeText>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AddressType;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.grey_10,
    paddingVertical: 13,
  },
  icon: {
    marginLeft: 13,
  },
  headrLabel: {
    marginLeft: 11,
  },
  defaultText: {
    fontSize: 11,
    color: colors.white,
  },
  defaultContainer: {
    justifyContent: 'center',
    marginLeft: 6,
  },
  default: {
    backgroundColor: colors.black,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
  },
  color: {
    backgroundColor: colors.green,
  },
});

AddressType.propTypes = {
  isDefault: PropTypes.bool,
};
AddressType.defaultProps = {
  isDefault: false,
};
