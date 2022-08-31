import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';
import DanubeText, { TextVariants } from '../DanubeText';

const HeaderCard = ({ label }) => {
  return (
    <View style={styles.main}>
      <DanubeText color={colors.black} mediumText variant={TextVariants.S}>
        {label}
      </DanubeText>
    </View>
  );
};

export default HeaderCard;

const styles = StyleSheet.create({
  main: {
    paddingTop: 25,
    paddingBottom: 11,
    paddingStart: 15,
  },
});

HeaderCard.propTypes = {
  label: PropTypes.string,
};

HeaderCard.defaultProps = {
  label: 'LABEL',
};
