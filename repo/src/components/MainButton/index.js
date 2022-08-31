import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import DanubeText, { TextVariants } from '../DanubeText';
import { Loader } from '../Loder';

const MainButton = ({
  label,
  style,
  backgroundColor,
  labelColor,
  onPress,
  disabled,
  processing = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.main, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled}
    >
      {!processing ? (
        <DanubeText color={labelColor} mediumText variant={TextVariants.S}>
          {label}
        </DanubeText>
      ) : (
        <Loader size={22} color={colors.white} />
      )}
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 5,
    backgroundColor: colors.black,
  },
});

MainButton.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  style: PropTypes.object,
  labelColor: PropTypes.string,
  onPress: PropTypes.func,
};

MainButton.defaultProps = {
  label: 'button label',
  style: {},
  labelColor: colors.white,
  backgroundColor: colors.black,
  onPress: () => {},
};
