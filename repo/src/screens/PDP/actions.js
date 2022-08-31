import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DH_ONLINE_USER_TOKEN } from '../../constants';
import { apiResponseLog } from '../../helper/Global';
import { GET_PRODUCT_DETAIL_FOR_MOBILE } from '../../helper/gql/pdp';
import useApiErrorsHandler from '../../helper/useApiErrorHandler';

const httpLink = new HttpLink({
  uri: 'https://dev-catalog-service.danubehome.com/graphql',
});
const handleApiError = useApiErrorsHandler();

const authMiddleware = new ApolloLink(async (operation, forward) => {
  // add the authorization to the headers
  const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
  operation.setContext({
    headers: {
      authorization: userToken ? `Bearer ${userToken}` : '',
    },
  });
  return forward(operation);
});
export const ApolloClientCatalogService = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export const getProductDetailForMobile = async (productDetailData) => {
  try {
    const { data } = await ApolloClientCatalogService.query({
      query: GET_PRODUCT_DETAIL_FOR_MOBILE,
      variables: productDetailData,
      fetchPolicy: 'network-only',
    });
    apiResponseLog(
      'GET_PRODUCT_DETAIL_FOR_MOBILE',
      {
        variables: productDetailData,
      },
      data
    );
    return { getProductDetailForMobileRes: data };
  } catch (error) {
    apiResponseLog(
      'GET_PRODUCT_DETAIL_FOR_MOBILE',
      {
        variables: productDetailData,
      },
      {},
      error
    );
    handleApiError(error);
    return { getProductDetailForMobileErr: error };
  }
};
