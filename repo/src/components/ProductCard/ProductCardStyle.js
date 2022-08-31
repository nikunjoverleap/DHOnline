import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      container: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderStyle: 'solid',
        borderRadius: 4,
        overflow: 'hidden',
      },
      img: {
        width: width / 2.4,
        height: 180,
      },
      bottomContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingTop: 5,
        width: width / 2.4,
      },
      nameLabel: {
        color: '#707070',
        fontSize: 14,
        paddingBottom: 3,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        minHeight: 36,
      },
      leftRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      specialPriceContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
      },
      specialPriceCurrencyLabel: {
        color: '#D12E27',
        fontSize: 15,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        marginRight: 2,
      },
      specialPriceLabel: {
        color: '#D12E27',
        fontSize: 18,
        marginRight: 5,
        fontFamily: language === 'ar' ? 'Tajawal-Bold' : 'Roboto-Bold',
        textAlign: 'left',
      },
      regularPriceLabel: {
        paddingBottom: 3,
        color: '#989898',
        fontSize: 14,
        textDecorationLine: 'line-through',
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
        textAlign: 'left',
      },
      featureLabel: {
        color: '#333333',
        fontSize: 12,
        paddingBottom: 3,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderColor: '#333333',
        borderWidth: 0.7,
        borderStyle: 'solid',
        borderRadius: 4,
        marginTop: 5,
      },
      btnLabel: {
        color: '#333333',
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
      },
      saleBadge: {
        position: 'absolute',
        top: 10,
        left: 0,
        backgroundColor: '#fff',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 3,
        paddingBottom: 3,
      },
      saleBadgeLabel: {
        color: '#F49658',
        fontSize: 11,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      bottomBadgeSection: {
        position: 'absolute',
        bottom: 10,
        right: 0,
      },
      marketBadge: {
        backgroundColor: '#fff',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 3,
        paddingBottom: 3,
      },
      marketBadgeLabel: {
        color: '#BC0E0E',
        fontSize: 11,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      featureBadge: {
        backgroundColor: '#fff',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 3,
        paddingBottom: 3,
        marginTop: 3,
      },
      featureLabel: {
        color: '#333333',
        fontSize: 11,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      favIconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#fff5',
        width: 30,
        height: 30,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
  }
}
