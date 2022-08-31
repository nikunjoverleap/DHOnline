import AsyncStorage from '@react-native-async-storage/async-storage';
import ApolloClientContentService from '../../ApolloClientContentService';
import ApolloClientCrossplayService from '../../ApolloClientCrossplayService';
import ApolloClientMagento from '../../ApolloClientMagento';
import { apiResponseLog } from '../../helper/Global';
import { GET_AUTSUGGEST } from '../../helper/gql/plp';
import {
  HOME_PAGE_LIST,
  SAVE_TO_WISHLIST,
  WISHLIST,
} from '../../helper/gql/query';

import {
  setHomePage,
  setHomePageFailed,
  setHomePageLoading,
} from '../../slicers/landing/landingSlice';

export const getHomePage = async ({ countryData, language }, dispatch) => {
  try {
    dispatch(setHomePageLoading(true));
    const { data } = await ApolloClientContentService.query({
      query: HOME_PAGE_LIST,
      variables: {
        pageId: countryData?.pageId ? countryData?.pageId : 'UAE Home Page',
        locale: language === 'ar' ? 'ar' : 'en-US',
      },
    });

    apiResponseLog(
      'HOME_PAGE_LIST',
      {
        countryData,
      },
      data
    );

    dispatch(setHomePage(data));
  } catch (error) {
    dispatch(setHomePageFailed(error?.message));
    apiResponseLog(
      'HOME_PAGE_LIST',
      {
        token: countryData,
      },
      {},
      error
    );
  }
};

export const addItemToWishlist = async (wishListData, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: SAVE_TO_WISHLIST,
      variables: {
        wishlistItem: wishListData,
      },
    });
    apiResponseLog(
      'SAVE_TO_WISHLIST',
      {
        wishListData: wishListData,
      },
      data
    );
    return data;
  } catch (error) {
    apiResponseLog(
      'SAVE_TO_WISHLIST',
      {
        wishListData: wishListData,
      },
      {},
      error
    );
  }
};

export const wishList = async () => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: WISHLIST,
    });
    apiResponseLog('WISHLIST', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('WISHLIST', {}, error);
  }
};

export const getAutoSugggest = async ({ query, country, language }) => {
  try {
    const { data } = await ApolloClientCrossplayService.query({
      query: GET_AUTSUGGEST,
      variables: {
        query,
        language,
        country,
      },
    });
    return data?.autosuggest || [];
  } catch (e) {
    apiResponseLog('getAutoSugggest', {}, e);
  }
};
