import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language, isShowMoreOption) {
    return StyleSheet.create({
      ModalContainer: {
        backgroundColor: '#fff',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: isShowMoreOption ? 0 : height / 2,

        position: 'relative',
        height: isShowMoreOption ? height : 'auto',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
      },
      contentContainer: {
        padding: 30,
        width: width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      SocialLoginTitle: {
        fontSize: 18,
        color: '#333333',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'center',
      },
      SocialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 10,
        borderColor: '#000000',
        borderWidth: 0.7,
        borderStyle: 'solid',
        borderRadius: 4,
      },
      SocialBtnLabel: {
        paddingLeft: 20,
        fontSize: 16,
        color: '#191919',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
      },
      ViewMoreOptionLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 15,
        marginTop: 20,
        color: '#333333',
        textAlign: 'center',
      },
      TermsAndConditionLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
        fontSize: 13,
        marginTop: 35,
        color: '#949494',
        textAlign: 'center',
        lineHeight: 20,
      },
      CloseBtn: {
        position: 'absolute',
        top: isShowMoreOption ? 50 : 10,
        right: isShowMoreOption ? 20 : 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#EEEEF3',
      },
      Logo: {
        marginBottom: 30,
        marginTop: isShowMoreOption ? 60 : null,
      },
      Seperator: {
        height: 1,
        backgroundColor: '#F6F6F8',
        width: width - 50,
      },
      TabRow: {
        display: 'flex',
        flexDirection: 'row',
        width: width - 50,
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 25,
      },
      TabBtn: {
        padding: 10,
        color: '#949494',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 16,
      },
      TabBtnSelected: {
        padding: 10,
        color: '#333333',
        fontFamily: language === 'ar' ? 'Tajawal-Bold' : 'Roboto-Bold',
        fontSize: 16,
        textDecorationLine: 'underline',
      },
      BlackBtn: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#333333',
        borderRadius: 4,
        width: width - 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
      BlackBtnLabel: {
        color: '#fff',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 15,
      },
      WhiteBtn: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 4,
        width: width - 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderStyle: 'solid',
        marginTop: 25,
      },
      WhiteBtnLabel: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 15,
      },
      OrSignInWithLabel: {
        color: '#333333',
        fontSize: 16,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'center',
      },
      SocialLoginIconRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
      },
      SocialLoginIconItem: {
        marginLeft: 25,
        marginRight: 25,
      },
      Input: {
        height: 50,
        padding: 10,
        width: width - 50,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },
      ForgotPassLink: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 12,
        textAlign: 'right',
        color: '#333333',
        textDecorationLine: 'underline',
        width: width - 50,
        marginBottom: 10,
      },
      PasswordIconContainer: {
        position: 'absolute',
        right: 10,
        width: 30,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      MobileInput: {
        height: 50,
        padding: 10,
        width: width - 125,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },
      MobileInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      CountryCode: {
        height: 50,
        backgroundColor: '#F6F6F8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 9,
        borderRadius: 4,
      },
      CountryCodeLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 16,
        textAlign: 'left',
        color: '#000000',
      },
      ResendOtpLink: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 12,
        textAlign: 'right',
        color: '#333333',
        textDecorationLine: 'underline',
        width: width - 50,
        marginBottom: 25,
      },
      NameInput: {
        height: 50,
        padding: 10,
        width: (width - 60) / 2,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },
      NameRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 50,
      },
      SendOtpBtn: {
        position: 'absolute',
        backgroundColor: '#D1D1D1',
        borderRadius: 3,
        height: 40,
        right: 5,
        top: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      },
      SendOtpBtnLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'auto',
        color: '#fff',
      },
      SendOtpBtnEnabled: {
        backgroundColor: '#333333',
        borderWidth: 1,
      },
      SendOtpBtnLabelEnabled: {
        color: '#fff',
      },
      MobileInputRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      RegOtpInput: {
        height: 50,
        padding: 10,
        width: width - 50,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },
      VerifyOtpBtn: {
        position: 'absolute',
        backgroundColor: '#333333',
        borderRadius: 3,
        height: 40,
        right: 5,
        top: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      },
      OtpVerified: {
        backgroundColor: '#fff',
        borderColor: '#05BE1E',
        borderWidth: 1,
      },
      VerifyOtpBtnLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'auto',
        color: '#fff',
      },
      VerifyOtpBtnLabelEnabled: {
        color: '#05BE1E',
      },
      errorrMsg: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 12,
        textAlign: 'left',
        color: '#D7151D',
        width: width - 50,
        marginBottom: 16,
        marginTop: 6,
      },
      halfErrorrMsg: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 12,
        textAlign: 'left',
        color: '#D7151D',
        width: (width - 50) / 2,
        marginBottom: 16,
        marginTop: 6,
      },
      errorrInput: {
        backgroundColor: '#FFF2F3',
        borderBottomColor: '#D7151D',
        borderBottomWidth: 0.7,
        borderBottomStyle: 'solid',
      },
      successMsgContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 40,
      },
      successTitle: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 20,
        textAlign: 'center',
        color: '#333333',
        maxWidth: width - 50,
        textTransform: 'uppercase',
        marginTop: 10,
      },
      successMsg: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 16,
        textAlign: 'center',
        color: '#50C0A8',
        maxWidth: width - 50,
        marginTop: 11,
      },
      resetPasswordLink: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 15,
        textAlign: 'left',
        color: '#333333',
        maxWidth: width - 50,
        marginTop: 40,
        marginBottom: 20,
      },
    });
  }
}
