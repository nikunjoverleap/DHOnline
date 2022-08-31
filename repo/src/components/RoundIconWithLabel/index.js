import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import DanubeText, { TextVariants } from '../DanubeText';
import { SvgUri } from 'react-native-svg';

const RoundIconWithLabel = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <View style={styles.main}>
          <SvgUri width="100%" height="100%" uri={icon} />
        </View>
      </View>
      <DanubeText variant={TextVariants.XS} center color={colors.black}>
        {label}
      </DanubeText>
    </TouchableOpacity>
  );
};

export default RoundIconWithLabel;

const styles = StyleSheet.create({
  container: {
    width: 70,
    alignItems: 'center',
    paddingBottom: 12,
    marginHorizontal: 15,
  },
  main: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 22,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 7,
  },
});

RoundIconWithLabel.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

RoundIconWithLabel.defaultProps = {
  label: 'label',
  icon: '',
  onPress: () => null,
};
