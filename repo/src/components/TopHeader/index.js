import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../styles/colors';
import HeaderIconWithLabel from './HeaderIconWithLabel';
const arrowIcon = <Icon name="arrowleft" size={30} color={colors.black} />;

const TopHeader = ({
  onBackPress,
  firstRightIcon,
  secondRightIcon,
  firstRightIconLabel,
  secondRightIconLabel,
}) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity style={styles.left} onPress={onBackPress}>
        {arrowIcon}
      </TouchableOpacity>
      <View style={styles.right}>
        {firstRightIcon ? (
          <HeaderIconWithLabel
            label={firstRightIconLabel}
            icon={firstRightIcon}
          />
        ) : null}
        {secondRightIcon ? (
          <HeaderIconWithLabel
            label={secondRightIconLabel}
            icon={secondRightIcon}
          />
        ) : null}
      </View>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  main: {
    minHeight: 50,
    borderBottomColor: colors.grey_2,
    borderBottomWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  right: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
});

TopHeader.propTypes = {
  label: PropTypes.string,
  onBackPress: PropTypes.func,
  firstRightIcon: PropTypes.element,
  secondRightIcon: PropTypes.element,
  secondRightIconLabel: PropTypes.string,
  firstRightIconLabel: PropTypes.string,
};

TopHeader.defaultProps = {
  label: 'LABEL',
  onBackPress: () => null,
  firstRightIcon: null,
  secondRightIcon: null,
  secondRightIconLabel: null,
  firstRightIconLabel: null,
};
