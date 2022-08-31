import { URL, URLSearchParams } from 'react-native-url-polyfill';
import ApolloClientCrossplayService from '../../ApolloClientCrossplayService';
import { apiResponseLog } from '../../helper/Global';
import { GET_PLP_LIST } from '../../helper/gql/plp';
import { setProductList } from '../../slicers/plp/plpSlice';

export const getProductList = async (
  {
    categoryId,
    store,
    query,
    pageSize = 20,
    pageOffset = 0,
    showFacets = false,
    filters = [],
    sort,
    productId,
    type,
    recommendationId,
    userId,
    numColumns = 2,
  },
  dispatch
) => {
  try {
    let catObj = new URL(
      `https://www.example.com${
        categoryId?.startsWith('/') ? categoryId : `/${categoryId}`
      }`
    );
    let newCategoryId = catObj.pathname;
    newCategoryId = (newCategoryId || '').replace(/^\//, '');
    const variables = {
      pageOffset,
      pageSize,
      showFacets,
      store,
      filters,
      productId,
      type,
      recommendationId,
      userId,
      numColumns,
    };
    if (sort) {
      variables.sort = sort;
    }
    if (categoryId) {
      variables.categoryId = newCategoryId;
    }
    if (query) {
      variables.query = query;
    }
    const { data } = await ApolloClientCrossplayService.query({
      query: GET_PLP_LIST,
      variables,
      //fetchPolicy: 'no-cache',
      fetchPolicy: 'network-only',
    });

    dispatch(setProductList(data));

    return data;
  } catch (e) {
    apiResponseLog(
      'GET_PLP_LIST',
      {
        categoryId,
        store,
        query,
        pageSize,
        pageOffset,
        showFacets,
        filters,
        sort,
        productId,
        type,
        recommendationId,
        userId,
        numColumns,
      },
      {},
      e
    );
  }
};
