import ApolloClientMagento from '../../ApolloClientMagento';
import { logError } from '../../helper/Global';
import {
  GET_WISHLIST,
  ADD_PRODUCT_TO_WISHLIST,
  REMOVE_SINGLE_PRODUCT_FROM_WISHLIST,
  CLEAR_WISHLIST,
  MOVE_SINGLE_PRODUCT_TO_CART,
  MOVE_WISHLIST_TO_CART,
} from '../../helper/gql/wishlist';
import { setWishlistProductList } from '../../slicers/wishlist/wishlistSlice';

export const getWishlist = async (dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_WISHLIST,
      fetchPolicy: 'no-cache',
    });

    if (data?.wishlist?.items) {
      await dispatch(setWishlistProductList(data?.wishlist?.items));
    }

    return data;
  } catch (error) {
    logError(error);
  }
};

export const removeSingleProductFromWishlist = async (id, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: REMOVE_SINGLE_PRODUCT_FROM_WISHLIST,
      variables: {
        itemId: id,
      },
    });
    if (data?.removeProductFromWishlist) {
      getWishlist(dispatch);
    }
    return data;
  } catch (error) {
    logError(error);
  }
};

export const addProductToWishlist = async (wishlistItem, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: ADD_PRODUCT_TO_WISHLIST,
      variables: {
        wishlistItem: wishlistItem,
      },
    });

    if (data?.saveWishlistItem?.added_at) {
      getWishlist(dispatch);
    }
    return data;
  } catch (error) {
    logError(error);
  }
};

export const clearWishlist = async (dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: CLEAR_WISHLIST,
    });
    if (data.clearWishlist) {
      dispatch(setWishlistProductList([]));
    }
    return data;
  } catch (error) {
    logError(error);
  }
};

export const moveSingleProductToCart = async (wishlistItemId, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: MOVE_SINGLE_PRODUCT_TO_CART,
      variables: {
        wishlistItemId: wishlistItemId,
      },
    });
    if (data?.moveWishlistItemToCart) {
      getWishlist(dispatch);
    }
    return data;
  } catch (error) {
    logError(error);
  }
};

export const moveWishlistToCart = async (dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: MOVE_WISHLIST_TO_CART,
    });
    if (data?.moveWishlistToCart) {
      dispatch(setWishlistProductList([]));
    }
    return data;
  } catch (error) {
    logError(error);
  }
};
