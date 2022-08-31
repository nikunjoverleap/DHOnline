import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language, screen) {
    return StyleSheet.create({
      imageItemContainerMainViewStyle: {
        // paddingHorizontal: 8,
      },
      imageStyle: {
        flex: 1,
      },
      imageItemContainerTitleTextStyle: {
        marginLeft: 5,
        marginTop: 5,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : screen === 'category'
            ? 'Roboto-Light'
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        color: '#707070',
        fontSize: 14,
      },
    });
  }
}
