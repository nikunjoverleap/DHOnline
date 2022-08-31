import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_MEDIUM,
  FONT_FAMILY_ARABIC_MEDIUM,
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      recommendationContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        marginVertical: 6.5,
      },
      recommendationTitle: {
        fontSize: 20,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        color: '#333333',
        paddingTop: 20,
        marginLeft: 14,
        marginRight: 14,
      },
      emptyPdp: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      emptyPdpIcon: {
        width: 240,
        height: 240,
        marginTop: 50,
        marginBottom: 50,
      },
      emptyPdpTitle: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        fontSize: 20,
        textAlign: 'center',
      },
      emptyPdpDesc: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 13,
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 30,
      },
      continueShoppingBtn: {
        width: width - 60,
        height: 55,
        backgroundColor: '#2B2B2B',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
      continueShoppingBtnLabel: {
        color: '#FFFFFF',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        fontSize: 16,
        textAlign: 'center',
      },
    });
  }
}
