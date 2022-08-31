import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      timerBlockContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyContent: 'center',
      },
      timerBlock: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 4,
        paddingTop: 4,
        backgroundColor: '#000',
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
      },
      timerLabel: {
        color: '#fff',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
      },
      timerBlockLabel: {
        color: '#000',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        fontSize: 10,
        marginTop: 2,
      },
      timerBlockDivider: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
    });
  }
}
