import { StyleSheet, Dimensions } from 'react-native';
export default class ProductDetailCarouselStyle {
  static getSheet() {
    return StyleSheet.create({
      paginationContainer: {
        width: '100%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      paginationDots: {
        width: 6,
        height: 6,
        marginLeft: 3,
        marginRight: 3,
        borderRadius: 3,
      },
      imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      },
      img: {
        height: '100%',
        width: '100%',
        // position: 'absolute',
      },
      rowTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
      },
      offerPriceContainer: {
        height: 27,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
      },
      otherTagsContainer: {
        height: 27,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
      bottomRightTagsContainer: {
        position: 'absolute',
        bottom: 10,
        right: 0,
      },
    });
  }
}
