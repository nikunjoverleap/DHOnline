import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import DanubeText, { TextVariants } from '../DanubeText';
import colors from '../../styles/colors';
import { SvgUri } from 'react-native-svg';
import Arrow from '../../../assets/svg/arrow.svg';
import ArrowForward from '../../../assets/svg/arrow-forward.svg';
import { rotateIcon } from '../../helper/Global';

const SubCard = ({ leftIcon, rightIcon, leftLabel, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.uri}>
          <SvgUri height={20} width={20} uri={leftIcon} />
        </View>
        <View style={styles.leftText}>
          <DanubeText color={colors.black} variant={TextVariants.XS}>
            {leftLabel}
          </DanubeText>
        </View>
        <Arrow width={20} height={20} />
      </View>
      <View style={styles.right}>
        {rightIcon ? (
          <View style={[styles.padding, rotateIcon]}>
            <ArrowForward width={25} height={25} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default SubCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 25,
    paddingVertical: 25,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  leftText: {
    paddingLeft: 11.55,
  },
  padding: {
    paddingRight: 17,
    paddingLeft: 8,
  },
  rightText: {
    paddingRight: 10,
  },
  uri: {
    paddingLeft: 15,
  },
});

SubCard.propTypes = {
  label: PropTypes.string,
  flagIcon: PropTypes.string,
  leftIcon: PropTypes.string,
  rightLabel: PropTypes.string,
  leftLabel: PropTypes.string,
  onPress: PropTypes.func,
};

SubCard.defaultProps = {
  label: 'LABEL',
  flagIcon: null,
  leftIcon: null,
  rightIcon: true,
  rightLabel: null,
  leftLabel: null,
  onPress: null,
};
