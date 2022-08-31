import { StyleSheet, Dimensions } from 'react-native';
import {
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';
export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        height: 50,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      logo: {
        height: 50,
        width: 100,
        marginLeft: 10,
        marginRight: 10,
      },
      leftContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
      },
      btn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
      },
      btnLabel: {
        color: '#000',
        fontSize: 10,
        paddingTop: 3,
        fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
      },
    });
  }
}
