import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Block from './Block';
import Password_Hide from '../../assets/svg/Password_Hide.svg';
import Password_View from '../../assets/svg/Password_View.svg';
import colors from '../styles/colors';

export const InputField = ({
  placeholder,
  onChangeText,
  value,
  isDisabled,
  containerStyle,
  isSecureText,
  keyboardType,
  autoCapitalize,
  maxLength,
  isInvalid,
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <Block
      flex={false}
      selfcenter
      padding={[10, 10, 10, 10]}
      margin={[5, 0, 5, 0]}
      radius={10}
      color={'white'}
      style={[
        styles.mainContainerDefaultStyle,
        { borderBottomWidth: isInvalid ? 1 : 0 },
        containerStyle,
      ]}
      row
    >
      <TextInput
        placeholderTextColor={colors.grey_8}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!isDisabled}
        secureTextEntry={isSecureText && !isShowPassword}
        style={styles.flex1}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
      {isSecureText ? (
        <TouchableOpacity
          style={{ marginRight: 5 }}
          onPress={() => setIsShowPassword(!isShowPassword)}
        >
          {isShowPassword ? (
            <Password_Hide height={20} width={20} />
          ) : (
            <Password_View height={20} width={20} />
          )}
        </TouchableOpacity>
      ) : null}
    </Block>
  );
};

const styles = StyleSheet.create({
  mainContainerDefaultStyle: {
    borderColor: '#D7151D',
  },
  flex1: { flex: 1 },
});
