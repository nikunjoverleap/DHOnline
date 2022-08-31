import { Dimensions, StyleSheet } from 'react-native';
import {
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_REGULAR,
} from '../../constants';
import colors from '../../styles/colors';
const { width, height } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language, isStoreSelected) {
    return StyleSheet.create({
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      storeList: {
        height: isStoreSelected ? height * 0.7 : height * 0.65,
      },
      storeItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        borderColor: '#E1E1E1',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#fff',
      },
      radio: {
        width: 17,
        height: 17,
        borderColor: '#333333',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        marginRight: 15,
      },
      radioSelected: {
        width: 17,
        height: 17,
        backgroundColor: '#333333',
        borderRadius: 10,
        marginRight: 15,
      },
      bottomFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        marginTop: 1,
        backgroundColor: '#ffff',
        borderColor: '#E1E1E1',
        borderTopWidth: 1,
        borderStyle: 'solid',
      },
      btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2B2B2B',
        height: 52,
        borderRadius: 4,
        width: width - 40,
      },
      btnLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
      },
      mapContainer: {
        height: isStoreSelected ? height * 0.3 : height * 0.35,
        backgroundColor: 'red',
      },
      mapStyle: {
        width: width,
        height: isStoreSelected ? height * 0.3 : height * 0.35,
      },
      selectedStoreAddressContainer: {
        padding: 20,
        backgroundColor: colors.white,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width,
        marginBottom: 13,
      },
      dhLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        fontSize: 16,
        color: '#333333',
        textAlign: 'left',
        paddingBottom: 12,
      },
      storeName: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 16,
        color: '#333333',
        textAlign: 'left',
        paddingBottom: 12,
      },
      storeTimeLabel: {
        fontFamily: language === 'ar' ? 'Tajawal-Italic' : 'Roboto-Italic',
        fontSize: 14,
        color: '#333333',
        textAlign: 'left',
      },
      changeBtn: {
        height: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#707070',
        paddingLeft: 13,
        paddingRight: 13,
      },
      changeBtnLabel: {
        color: '#0A0A0A',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'center',
      },
      contactInfoContainer: {
        padding: 15,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingBottom: 100,
      },
      contactInfoTitle: {
        color: '#0A0A0A',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
      },
      contactInfoDesc: {
        color: '#0A0A0A',
        fontSize: 14,
        textAlign: 'left',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        paddingTop: 12,
      },
      inputContainer: {
        paddingTop: 15,
      },
      input: {
        height: 50,
        padding: 10,
        width: width - 30,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },

      errorrInput: {
        backgroundColor: '#FFF2F3',
        borderBottomColor: '#D7151D',
        borderBottomWidth: 0.7,
        borderBottomStyle: 'solid',
      },
      nameRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 30,
      },
      nameInput: {
        height: 50,
        padding: 10,
        width: (width - 45) / 2,
        backgroundColor: '#F6F6F8',
        borderRadius: 4,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 14,
        textAlign: 'left',
      },
      nameErrorrMsg: {
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
    });
  }
}
