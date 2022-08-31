import ApolloClientMagento from '../../ApolloClientMagento';
import { apiResponseLog } from '../../helper/Global';
import { CREATE_EMPTY_CART } from '../../helper/gql';

export const createEmptyCart = async () => {
  try {
    const { data } = await ApolloClientMagento.mutate({
      mutation: CREATE_EMPTY_CART,
    });
    apiResponseLog('CREATE_EMPTY_CART', {}, data);
    return data;
  } catch (error) {
    apiResponseLog('CREATE_EMPTY_CART', {}, error);
  }
};
