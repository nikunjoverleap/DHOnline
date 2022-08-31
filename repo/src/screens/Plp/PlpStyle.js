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
      filterAndSortBar: {
        flexDirection: 'row',
      },
      filterAndSortBarItem: {
        backgroundColor: '#fff',
        width: width / 2,
        paddingTop: 18,
        paddingBottom: 18,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#EAEAEC',
        borderBottomWidth: 1,
        borderStyle: 'solid',
      },
      filterAndSortBarItemLabel: {
        fontSize: 15,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textTransform: 'capitalize',
        textAlign: 'center',
        color: '#333333',
      },
      filterAndSortBarItemIcon: {
        paddingRight: 12,
      },
      filterAndSortBarItemDivider: {
        width: 1,
        backgroundColor: '#EAEAEC',
      },
      //sort
      ModalContainer: {
        backgroundColor: '#fff',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        position: 'relative',
        height: 'auto',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
      },
      CloseBtn: {
        position: 'absolute',
        top: 18,
        right: 18,
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#EEEEF3',
      },
      SortHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomColor: '#4A434329',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        marginLeft: 18,
        marginRight: 18,
      },
      SortTitle: {
        fontSize: 18,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        textTransform: 'capitalize',
        textAlign: 'center',
        color: '#333333',
      },
      SortBody: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 30,
      },
      SortItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
      },
      SortItemRadioBtn: {
        width: 17,
        height: 17,
        borderColor: '#333333',
        borderWidth: 1,
        borderRadius: 9,
        backgroundColor: '#fff',
        marginRight: 12,
      },
      SortItemRadioBtnChecked: {
        backgroundColor: '#333333',
      },
      SortItemLabel: {
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        color: '#333333',
      },
      //filter
      FilterFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
      },
      FilterResetBtn: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#707070',
        padding: 18,
        borderRadius: 4,
      },
      FilterResetBtnLabel: {
        fontSize: 16,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        textAlign: 'center',
        color: '#333333',
        textTransform: 'uppercase',
        width: language === 'ar' ? (width - 45) * 0.3 : (width - 45) * 0.3,
      },
      FilterApplyBtn: {
        padding: 18,
        backgroundColor: '#2F2F2F',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: language === 'ar' ? (width - 45) * 0.6 : (width - 45) * 0.6,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#2F2F2F',
      },
      FilterApplyBtnItemsLabel: {
        fontSize: 16,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'center',
        color: '#fff',
      },
      FilterApplyBtnLabel: {
        fontSize: 16,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        textAlign: 'center',
        color: '#fff',
      },
      FilterHeader: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 46 : 16,
      },
      FilterCancelBtn: {
        marginRight: 26,
      },
      FilterCancelBtnLabel: {
        paddingRight: 10,
        paddingLeft: 10,
        fontSize: 18,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        color: '#333333',
      },
      FilterHeaderLabel: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 18,
      },
      FilterHeaderLeftSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      FilterHeaderBackBtn: {
        paddingLeft: 16,
        paddingRight: 16,
        transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
      },
      //banner
      PlpBannerImg: {
        width: width - 22,
        minHeight: 60,
        borderRadius: 4,
        marginBottom: 12,
      },
      //sub category
      SubCategoryItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight: 12,
        marginBottom: 12,
        width: width / 2.5,
        backgroundColor: '#F7F8FA',
        borderRadius: 4,
      },
      SubCategoryItemImg: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 10,
      },
      SubCategoryName: {
        width: width / 2.5 - 70,
        textTransform: 'capitalize',
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        paddingRight: 10,
      },
      //plp filter side bar
      PlpFilterSideBarContainer: {
        backgroundColor: '#F6F6F8',
        height: height - 185,
      },
      PlpFilterSideBarItemContainer: {
        maxWidth: '35%',
        backgroundColor: '#F7F8FA',
      },
      PlpFilterSideBarLabel: {
        fontSize: 14,
        textAlign: 'left',
        paddingLeft: 12,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
      },
      PlpFilterSideBarSelectedItemsLabel: {
        fontSize: 12,
        color: '#424242',
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 3,
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-LightItalic',
        textAlign: 'left',
      },
      //FacetCheckBox
      FacetCheckBoxContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 11,
      },
      FacetCheckBoxContainerForColor: {
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 8,
        borderRadius: 4,
        marginLeft: 11,
        marginBottom: 6,
      },
      FacetCheckBoxContainerForNormal: {
        marginBottom: 17,
      },
      FacetCheckBox: {
        height: 17,
        width: 17,
        borderWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
      },
      FacetCheckBoxLabel: {
        color: '#333333',
        fontSize: 14,
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        textAlign: 'left',
        paddingLeft: 9,
      },
      //customslider
      CustomSliderMarkerLeftContaner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        position: 'relative',
        borderColor: '#333333',
        borderWidth: 5,
        borderStyle: 'solid',
        zIndex: 2,
      },
      CustomSliderLeftMarkerLabelContainer: {
        position: 'absolute',
        top: -25,
        backgroundColor: '#333333',
        paddingTop: 2.5,
        paddingBottom: 2.5,
        paddingLeft: 4.5,
        paddingRight: 4.5,
        minWidth: 60,
        borderRadius: 4,
      },
      CustomSliderLeftMarkerLabel: {
        color: '#fff',
        fontSize: 11,
        textAlign: 'center',
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
      },
      CustomSliderLeftMarkerLabelDownArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#333333',
        position: 'absolute',
        top: -10,
        right: 0,
      },
      CustomSliderMarkerRightContaner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        position: 'relative',
        borderColor: '#333333',
        borderWidth: 5,
        borderStyle: 'solid',
        zIndex: 2,
      },
      CustomSliderRightMarkerLabelContainer: {
        position: 'absolute',
        top: -25,
        backgroundColor: '#333333',
        paddingTop: 2.5,
        paddingBottom: 2.5,
        paddingLeft: 4.5,
        paddingRight: 4.5,
        minWidth: 65,
        width: '100%',
        borderRadius: 4,
      },
      CustomSliderRightMarkerLabel: {
        color: '#fff',
        fontSize: 11,
        textAlign: 'center',
        fontFamily: language === 'ar' ? 'Tajawal-Light' : 'Roboto-Light',
      },
      CustomSliderRightMarkerLabelDownArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#333333',
        position: 'absolute',
        top: -10,
        left: 0,
      },
      LimitRangeRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 12,
      },
      LimitRangeLabel: {
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_REGULAR
            : FONT_FAMILY_ENGLISH_REGULAR,
        fontSize: 13,
        color: '#333333',
        textAlign: 'left',
      },
      backIcon: {
        padding: 10,
        transform: language === 'ar' ? [{ rotate: '180deg' }] : [],
      },
      emptyPlp: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      emptyPlpIcon: {
        width: 240,
        height: 240,
        marginTop: 50,
        marginBottom: 50,
      },
      emptyPlpTitle: {
        color: '#333333',
        fontFamily:
          language === 'ar'
            ? FONT_FAMILY_ARABIC_MEDIUM
            : FONT_FAMILY_ENGLISH_MEDIUM,
        fontSize: 20,
        textAlign: 'center',
      },
      emptyPlpDesc: {
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
