import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      container: {
        backgroundColor: '#F6F6F8',
      },
      card: {
        paddingTop: 20,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        marginBottom: 13,
      },
      shippingAddressHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 11,
        paddingRight: 11,
        backgroundColor: '#F5F5F7',
        borderRadius: 4,
        marginBottom: 11,
      },
      shippingAddressHeaderLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        color: '#0A0A0A',
        fontSize: 16,
        textAlign: 'left',
        paddingLeft: 9,
      },
      titleLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 16,
        color: '#0A0A0A',
        textAlign: 'left',
        paddingLeft: 9,
      },
      nameLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 16,
        color: '#0A0A0A',
        textAlign: 'left',
        paddingBottom: 14,
      },
      shippingAddressLabel: {
        color: '#333333',
        fontSize: 13,
        textAlign: 'left',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        marginBottom: 13,
      },
      iconTitleRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
      },
      orderItemListContainer: {},
      orderItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 9,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        marginTop: 8,
      },
      itemImgConatiner: {
        width: 110,
        height: 110,
        borderRadius: 4,
        borderColor: '#E9E9E9',
        borderWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
      },
      itemImg: {
        width: 110,
        height: 110,
        borderRadius: 4,
        overflow: 'hidden',
      },
      orderItemRightSection: {
        marginLeft: 10,
      },
      productName: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'left',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        paddingTop: 10,
      },
      saveLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 12,
        color: '#333333',
        textAlign: 'left',
        paddingTop: 5,
      },
      productQty: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 13,
        color: '#333333',
        textAlign: 'left',
        paddingTop: 5,
      },
      currencyLabel: {
        color: '#333333',
        fontSize: 15,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        paddingTop: 5,
      },
      nowPriceLabel: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'left',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
      },
      wasPrice: {
        color: '#989898',
        fontSize: 13,
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
        textAlign: 'left',
        textDecorationLine: 'line-through',
        marginLeft: 3,
      },
      orderSummeryContainer: {
        paddingTop: 20,
        paddingBottom: 20,
      },
      orderSummeryTitle: {
        color: '#0A0A0A',
        fontSize: 16,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'left',
        paddingBottom: 20,
      },
      rowEnd: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 13,
      },
      subTotalContainer: {
        paddingTop: 20,
        paddingBottom: 13,
      },
      subTotalLabel: {
        color: '#424242',
        fontSize: 14,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'left',
      },
      subTotalValue: {
        color: '#424242',
        fontSize: 14,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'right',
      },
      orderSummeryItemLabel: {
        color: '#424242',
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      orderSummeryItemValue: {
        color: '#424242',
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'right',
      },
      youPayContainer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopColor: '#E9E9E9',
        borderStyle: 'solid',
        borderTopWidth: 1,
        paddingBottom: 0,
      },
      youPayLabel: {
        color: '#424242',
        fontSize: 18,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'left',
      },
      taxLabel: {
        color: '#989898',
        fontSize: 10,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        paddingTop: 2,
      },
      continueBtn: {
        width: width - 28,
        marginBottom: 20,
        backgroundColor: '#2B2B2B',
        height: 52,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      continueBtnLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        marginRight: 8,
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      successMsgContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      successMsgTitle: {
        fontSize: 34,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        color: '#2B2B2B',
        textAlign: 'center',
        width: width - 150,
        marginTop: 25,
      },
      successMsgDesc: {
        fontSize: 15,
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        width: width - 150,
        marginTop: 16,
        marginBottom: 20,
        textAlign: 'center',
      },
      pickupAddressTitle: {
        fontSize: 16,
        color: '#0A0A0A',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'left',
      },
      pickupAddressLabel: {
        fontSize: 13,
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        paddingTop: 10,
      },
      mapLink: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 13,
        textAlign: 'left',
        textDecorationLine: 'underline',
        paddingTop: 10,
        marginBottom: 20,
      },
      receiverInfoRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 14,
      },
      receiverInfoLabelSection: {
        width: (width - 28) / 3.5,
      },
      receiverInfoLabel: {
        fontSize: 11,
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      receiverInfoValue: {
        fontSize: 13,
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      receiverName: {
        fontSize: 16,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        color: '#0A0A0A',
        textAlign: 'left',
      },
    });
  }
}
