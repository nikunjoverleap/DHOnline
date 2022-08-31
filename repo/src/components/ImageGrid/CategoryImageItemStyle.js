import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import {
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_REGULAR,
} from '../../constants';

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      categoryImageItemContainer: {},
      categoryImageItemLabel: {
        marginLeft: 4,
        marginTop: 4,
        marginBottom: 5,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        color: '#333333',
        fontSize: 13,
      },
    });
  }
}
