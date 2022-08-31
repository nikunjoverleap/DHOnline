import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { FONT_FAMILY_ARABIC_REGULAR } from '../../constants';

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      ImageScrollerMainViewStyle: {},
      ImageScrollerTitleTextStyle: {
        fontSize: 15,
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        textAlign: 'left',
        color: '#333333',
      },
      marginTop15: { marginTop: 15 },
      imageItemContainerTitleTextStyle: {
        fontSize: 10,
        fontFamily:
          language === 'ar' ? FONT_FAMILY_ARABIC_REGULAR : 'Roboto-Light',
        marginBottom: 3,
        textAlign: 'left',
      },
      collapseHeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        paddingTop: 15,
        paddingBottom: 10,
      },
      collapseHeaderContainerExpanded: {
        // borderTopWidth: 1,
        // borderTopStyle: 'solid',
        // borderTopColor: '#F6F6F8',
      },
      collapseHeaderContainerNotExpanded: {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#F6F6F8',
      },
      collapseHeaderArrow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 25,
        height: 25,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F6F6F8',
      },
      collapseHeaderArrowRotate: {
        transform: [{ rotate: '180deg' }],
      },
      collapseBodyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#F6F6F8',
        paddingBottom: 15,
      },
    });
  }
}
