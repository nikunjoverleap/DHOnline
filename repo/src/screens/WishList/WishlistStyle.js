import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_MEDIUM,
  FONT_FAMILY_ARABIC_MEDIUM,
} from '../../constants';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      container: {
        backgroundColor: '#F6F6F8',
        flex: 1,
        position: 'relative',
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom: 17,
        marginTop: Platform.OS === 'ios' ? 30 : 0,
      },
      headerTitle: {
        color: '#333333',
        fontSize: 20,
        textAlign: 'center',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
      },
      backIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 12,
        marginRight: 12,
        transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
      },
      countLabel: {
        fontSize: 16,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        color: '#333333',
        textAlign: 'center',
        paddingBottom: 20,
      },
      listContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 28,
        borderTopLeftRadius: 28,
        // marginBottom: 0.5,
        paddingLeft: 15,
        paddingRight: 15,
      },
      listItem: {
        width: width - 32,
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        borderWidth: 0.3,
        margin: 1,
        padding: 9,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 16,
      },
      listItemImg: {
        width: 120,
        height: 120,
        borderRadius: 4,
        borderColor: '#E9E9E9',
        borderWidth: 0.5,
        borderStyle: 'solid',
        overflow: 'hidden',
      },
      listItemRightSection: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 9,
      },
      itemName: {
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        color: '#333333',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 12,
        width: width - 180,
      },
      currencyLabel: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 15,
        textAlign: 'left',
      },
      nowPriceLabel: {
        color: '#333333',
        fontFamily: language === 'ar' ? 'Tajawal-Bold' : 'Roboto-Bold',
        fontSize: 18,
        paddingLeft: 2,
        paddingRight: 5,
        textAlign: 'left',
      },
      wasPrice: {
        color: '#989898',
        fontSize: 13,
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
        textAlign: 'left',
        textDecorationLine: 'line-through',
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      btn: {
        height: 30,
        borderRadius: 4,
        borderColor: '#707070',
        borderWidth: 1,
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
      },
      btnLabel: {
        color: '#0A0A0A',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        fontSize: 14,
      },
      bottomStickyRow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        backgroundColor: '#fff',
        marginTop: 1,
        marginBottom: 0.3,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
      },
      rmvAllBtn: {
        height: 55,
        width: (width - 40) / 2,
        borderColor: '#707070',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      moveToCartBtn: {
        height: 55,
        width: (width - 40) / 2,
        borderColor: '#333333',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
      },
      moveToCartBtnLabel: {
        color: '#FFFFFF',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'center',
      },
      rmvAllBtnLabel: {
        color: '#0A0A0A',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'center',
      },
      emptyWishlist: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      emptyWishlistIcon: {
        width: 240,
        height: 240,
        marginTop: 50,
        marginBottom: 50,
      },
      emptyWishlistTitle: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        fontSize: 20,
        textAlign: 'center',
      },
      emptyWishlistDesc: {
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
