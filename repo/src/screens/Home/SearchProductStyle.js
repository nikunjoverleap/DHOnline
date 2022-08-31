import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language, searchText) {
    return StyleSheet.create({
      headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        marginBottom: 1,
        backgroundColor: '#fff',
        // paddingTop: //Platform.OS === 'ios' ? 16 : 16,
        paddingLeft: 12,
        paddingRight: 22,
      },
      searchInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 85,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 4,
        borderColor: '#E1E1E1',
        height: 44,
        padding: 10,
        marginTop: 12,
        marginBottom: 12,
        marginLeft: 15,
      },
      searchInputStyle: {
        width: searchText ? width - 120 : width - 130,
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: language === 'ar' ? 'right' : 'left',
      },
      searchResultItem: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        width: width - 40,
        marginLeft: 20,
        marginRight: 20,
      },
      searchResultItemLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        color: '#333333',
        textAlign: 'left',
      },
      lineStyle: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: 20,
        marginRight: 20,
      },
      searchSuggessionContainer: {
        paddingLeft: 13,
        paddingRight: 13,
        width: width - 26,
      },
      searchSuggessionSection: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 27,
      },
      searchSuggessionTitleContainer: {
        paddingBottom: 13,
        marginBottom: 13,
        borderBottomColor: '#E3E3E3',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        width: width - 26,
      },
      searchSuggessionTitle: {
        fontSize: 16,
        color: '#0A0A0A',
        textAlign: 'left',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
      },
      searchSuggessionItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      searchSuggessionItem: {
        backgroundColor: '#F7F8FA',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E3E3E3',
        borderRadius: 4,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 8,
        paddingTop: 8,
        marginRight: 8,
        marginBottom: 8,
      },
      searchSuggessionItemLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 13,
        color: '#333333',
        textAlign: 'center',
      },
      backIcon: {
        padding: 10,
        transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
      },
    });
  }
}
