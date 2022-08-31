import { countryList } from '../constants';

export const getCountryData = ({ country = 'ae' }) => {
  return countryList.find((cn) => cn.isoCode === country);
};

export const getDHStore = ({ country, language }) => {
  return `${country}_${language}`;
};

// export const getAuthBearerToken = ({
//   isGuest,
//   pwaAuthToken,
//   pwaGuestToken,
// }) => {
//   return `Bearer ${
//     isGuest ? 'h9rtjprc8dx6rqzjfxx3vhetj6j28e7c' : pwaAuthToken
//   }`;
// };
