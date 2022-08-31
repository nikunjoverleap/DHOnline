import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({});
  }
}
