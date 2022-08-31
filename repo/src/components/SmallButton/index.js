import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import DanubeText, { TextVariants } from '../DanubeText';
import colors from '../../styles/colors';

const SmallButton = ({ label, onPress, extraStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.main, extraStyle]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <DanubeText variant={TextVariants.XXS} color={colors.black_3}>
        {label}
      </DanubeText>
    </TouchableOpacity>
  );
};

export default SmallButton;

const styles = StyleSheet.create({
  main: {
    borderWidth: 1,
    paddingVertical: 6.5,
    paddingHorizontal: 13.5,
    borderRadius: 4,
    borderColor: colors.grey_7,
  },
});

SmallButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  extraStyle: PropTypes.object,
};

SmallButton.defaultProps = {
  label: 'label',
  onPress: () => null,
  extraStyle: {},
};
