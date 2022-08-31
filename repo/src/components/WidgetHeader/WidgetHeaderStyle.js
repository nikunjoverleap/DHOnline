import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default class StyleSheetFactory {
  static getSheet(language) {
    return StyleSheet.create({
      headerRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 10,
      },
      title: {
        fontSize: 16,
        color: '#333333',
        fontFamily: language === 'ar' ? 'Tajawal-Medium' : 'Roboto-Medium',
        maxWidth: width / 2,
        textAlign: 'left',
      },
    });
  }
}
