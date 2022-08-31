import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width } = Dimensions.get('window');

export default class ProductCardStyle {
  static getSheet(language) {
    return StyleSheet.create({
      container: {
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderStyle: 'solid',
        marginBottom: 10,
        marginRight: 10,
        borderRadius: 4,
        overflow: 'hidden',
      },
      imgSquare: {
        width: (width - 36) / 2,
        height: (width - 36) / 2,
      },
      imgRectangle: {
        width: (width - 36) / 2,
        height: ((width - 36) / 2) * 0.7,
      },

      bottomContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingTop: 5,
        width: (width - 36) / 2,
      },
      nameLabel: {
        color: '#333333',
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
        color: '#989898',
        fontSize: 13,
        textDecorationLine: 'line-through',
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
        textAlign: 'left',
        marginBottom: 3,
      },
      multiColorSizeLabel: {
        color: '#333333',
        fontSize: 12,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        paddingLeft: 3,
      },
      multiColorSizeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
      },
      btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderColor: '#333333',
        borderWidth: 0.5,
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
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
      discountBadge: {
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
      discountLabel: {
        color: '#BC0E0E',
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
        borderRadius: 20,
      },
      favIconInnerContainer: {
        width: 28,
        height: 28,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
  }
}
