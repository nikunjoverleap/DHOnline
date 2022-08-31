import { StyleSheet, Dimensions } from 'react-native';
export default class StyleSheetFactory {
  static getSheet() {
    return StyleSheet.create({
      container: {
        height: 60,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      paginationContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: -20,
        padding: 3,
        width: '100%',
      },
      paginationDots: {
        width: 8,
        height: 8,
        marginLeft: 4,
        marginRight: 4,
        borderRadius: 5,
      },
      imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
      },
      img: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      rowTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
      },
    });
  }
}
