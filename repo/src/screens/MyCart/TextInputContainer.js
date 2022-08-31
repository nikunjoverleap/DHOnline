import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Block from '../../components/Block';
import { InputField } from '../../components/InputField';
import colors from '../../styles/colors';

function TextInputContainer({
  value,
  onChangeText = () => {},
  placeholder,
  keyboardType,
  isInvalid,
}) {
  return (
    <InputField
      containerStyle={[
        styles.continer,
        isInvalid ? { backgroundColor: '#FFF2F3' } : {},
      ]}
      placeholder={placeholder}
      onChangeText={(text) => {
        onChangeText(text);
      }}
      value={value}
      keyboardType={keyboardType}
      isInvalid={isInvalid}
    />
  );
}
export default TextInputContainer;

const styles = StyleSheet.create({
  continer: {
    borderRadius: 4,
    backgroundColor: colors.grey_11,
    minHeight: 52,
  },
});
