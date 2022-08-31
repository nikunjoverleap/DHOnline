import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DeleteIcon from '../../../../assets/svg/Delete.svg';
import SmallButton from '../../../components/SmallButton';

const AddressFooter = ({
  editButton,
  deleteButton,
  buttonLabel,
  onEditPress,
}) => {
  return (
    <View style={styles.main}>
      {deleteButton ? (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => null}
          style={styles.margin}
        >
          <DeleteIcon width={25} height={25} />
        </TouchableOpacity>
      ) : null}
      {editButton ? (
        <SmallButton label={buttonLabel} onPress={onEditPress} />
      ) : null}
    </View>
  );
};

export default AddressFooter;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  margin: {
    marginRight: 19,
  },
});

AddressFooter.propTypes = {
  extraStyle: PropTypes.object,
  editButton: PropTypes.bool,
  deleteButton: PropTypes.bool,
};
AddressFooter.defaultProps = {
  extraStyle: {},
  deleteButton: false,
  editButton: false,
};
