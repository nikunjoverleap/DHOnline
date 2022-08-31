import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DH_ONLINE_USER_TOKEN } from './constants';
import { logInfo } from './helper/Global';
import { env } from './src/config/env';

const httpLink = new HttpLink({
  uri: (req) => {
    logInfo('MAGENTO GRAPHQL OPERATION:', req);
    return `${
      req.operationName === 'placeOrder'
        ? 'https://mcstaging.danubehome.com/' // TODO REMOVE THIS CODE WHEN IT GOES TO PRODUCTION
        : env.BASE_URL
    }graphql`;
  },
});

const authMiddleware = new ApolloLink(async (operation, forward) => {
  // add the authorization to the headers
  const userToken = await AsyncStorage.getItem(DH_ONLINE_USER_TOKEN);
  logInfo('User Token', userToken);
  operation.setContext({
    headers: {
      authorization: userToken ? `Bearer ${userToken}` : '',
    },
  });
  return forward(operation);
});
export const ApolloClientMagento = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default ApolloClientMagento;
