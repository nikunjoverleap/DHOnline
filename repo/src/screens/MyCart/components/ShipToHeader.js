import { StyleSheet, View } from 'react-native';
import React from 'react';
import DanubeText, { TextVariants } from '../../../components/DanubeText';

import colors from '../../../styles/colors';
import PropTypes from 'prop-types';
import SmallButton from '../../../components/SmallButton';

const ShipToHeader = ({
  label,
  button = false,
  extraStyle,
  buttonLabel,
  onPress,
}) => {
  return (
    <View style={[styles.main, extraStyle]}>
      <DanubeText mediumText color={colors.black_3} variant={TextVariants.S}>
        {label}
      </DanubeText>
      {button ? <SmallButton label={buttonLabel} onPress={onPress} /> : null}
    </View>
  );
};

export default ShipToHeader;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 10,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 9,
    borderRadius: 4,
  },
});

ShipToHeader.propTypes = {
  label: PropTypes.string,
  extraStyle: PropTypes.object,
  buttonLabel: PropTypes.string,
  onPress: PropTypes.func,
};

ShipToHeader.defaultProps = {
  label: 'label',
  extraStyle: {},
  buttonLabel: 'label',
  onPress: () => null,
};
