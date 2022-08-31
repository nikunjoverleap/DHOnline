import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';

export const ActionButton = ({
  onPress,
  labelStyle,
  label,
  buttonColor,
  buttonStyle,
  secondLabel,
  secondLabelStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: buttonColor ? buttonColor : 'white',
        },
        styles.buttonDefaultStyle,
        buttonStyle,
      ]}
    >
      <Text style={[{ fontSize: 10 }, labelStyle]}>
        {label}
        {secondLabel && (
          <Text style={[{ fontSize: 10 }, secondLabelStyle]}>
            {secondLabel}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonDefaultStyle: {
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'center',
  },
});
