import { LANDED_VIA_PUSH_NOTIFICATION } from '../constants';
import { handleDeepLinking } from './Global';

export const handleDeeplink = ({
  url,
  country,
  language,
  DEEPLINK_CONFIG_DATA,
  navigation,
}) => {
  const mainLink = url?.includes('.com/')
    ? url?.split('.com/')
    : url?.split('://');
  const urlSplit = ('/' + mainLink?.[1]).split('?');
  const subLink = urlSplit?.[0];
  const queryString = urlSplit[1];
  const urlKey = subLink.split(country + '/' + language + '/')[1];

  const urlObj = new URL(`https://danubehome.com/${mainLink?.[1]}`); // Just for gettng the query to object
  //   let urlKey = pathname.split('/')?.splice(3)?.join('/');

  handleDeepLinking({
    deepLinkArray: DEEPLINK_CONFIG_DATA,
    subLink,
    urlKey,
    navigation,
    via: LANDED_VIA_PUSH_NOTIFICATION,
    linkForLogging: url,
    queryString,
    query: Object.entries(urlObj.searchParams),
  });
};
