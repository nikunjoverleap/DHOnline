import ApolloClientMagento from '../../ApolloClientMagento';
import { logError } from '../../helper/Global';
import { GET_STORE_INFORMATION } from '../../helper/gql/ClickAndCollect';
import { setStoreInformation } from '../../slicers/ClickAndCollect/ClickAndCollectSlice';

export const getStoreInformation = async (guestCartId, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_STORE_INFORMATION,
      fetchPolicy: 'no-cache',
      variables: {
        guestCartId: guestCartId,
      },
    });

    if (data) {
      await dispatch(setStoreInformation(data));
    }

    return data;
  } catch (error) {
    logError(error);
  }
};
