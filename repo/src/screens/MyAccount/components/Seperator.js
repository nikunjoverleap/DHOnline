import { View, StyleSheet } from 'react-native';
import React from 'react';

const Seperator = ({ bold }) => {
  return <View style={[bold ? styles.bold : styles.line]} />;
};

export default Seperator;

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginHorizontal: 14.5,
  },
  bold: {
    backgroundColor: '#F6F6F8',
    height: 13,
  },
});
