/* eslint-disable react-native/no-color-literals */
/* eslint-disable no-dupe-keys */
import * as React from 'react';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { colors, deviceWidth, font } from '../constants/theme';

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 10,
  },
  cellRoot: {
    width: 50,
    height: 30,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 10,
  },
  cellText: {
    color: colors.black,
    fontSize: 20,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#DD1B28',
    borderBottomWidth: 2,
  },
});

export const MyCodeField = ({ value, onChangeText, cellCount, ...rest }) => {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={onChangeText}
      cellCount={cellCount}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <View
          onLayout={getCellOnLayoutHandler(index)}
          key={index}
          style={[styles.cellRoot, isFocused && styles.focusCell]}
        >
          <Text style={styles.cellText}>
            {symbol || (isFocused ? <Cursor /> : "*")}
          </Text>
        </View>
      )}
    />
  );
};
