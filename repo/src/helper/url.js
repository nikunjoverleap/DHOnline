import { env } from '../src/config/env';

export const targetToNewUrl = ({
  relativeUrl = '',
  language = '',
  country = '',
}) => {
  return `${env.BASE_URL}${country}/${language}${relativeUrl}`;
};
