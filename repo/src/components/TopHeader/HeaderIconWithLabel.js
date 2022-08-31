import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../styles/colors';
import DanubeText, {TextVariants} from '../DanubeText';

const HeaderIconWithLabel = ({icon, label}) => {
  return (
    <View style={styles.main}>
      {icon}
      <DanubeText variant={TextVariants.XS} color={colors.icon_color}>
        {label}
      </DanubeText>
    </View>
  );
};

export default HeaderIconWithLabel;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});

HeaderIconWithLabel.propTypes = {
  label: PropTypes.string,
  onBackPress: PropTypes.func,
  firstRightIcon: PropTypes.element,
  secondRightIcon: PropTypes.element,
  secondRightIconLabel: PropTypes.string,
  firstRightIconLabel: PropTypes.string,
};

HeaderIconWithLabel.defaultProps = {
  label: 'LABEL',
  onBackPress: () => null,
  firstRightIcon: null,
  secondRightIcon: null,
  secondRightIconLabel: null,
  firstRightIconLabel: null,
};
