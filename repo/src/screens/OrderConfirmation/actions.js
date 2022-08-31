import ApolloClientMagento from '../../ApolloClientMagento';
import { logError, logInfo } from '../../helper/Global';
import { GET_ORDER_CONFIRMATION_DETAILS } from '../../helper/gql/OrderConfirmation';
import {
  setOrderConfirmationDetails,
  setOrderConfirmationLoader,
  setOrderStatus,
} from '../../slicers/orderConfirmation/orderConfirmationSlice';
export const getOrderConfirmationDetails = async (token, dispatch) => {
  try {
    const { data } = await ApolloClientMagento.query({
      query: GET_ORDER_CONFIRMATION_DETAILS,
      fetchPolicy: 'no-cache',
      variables: {
        token: token,
      },
    });

    if (data?.getOrderStatusByToken?.order) {
      await dispatch(
        setOrderConfirmationDetails(data?.getOrderStatusByToken?.order)
      );
      await dispatch(
        setOrderStatus(data?.getOrderStatusByToken?.is_success || true)
      ); //TODO TO BE REMOVED AFTER PAYFORT DTF INTEGRATION
    }

    return data;
  } catch (error) {
    logError(error);
    await dispatch(setOrderConfirmationLoader());
    return false;
  }
};
