import { gql } from '@apollo/client';
import ApolloClientContentFul from '../../ApolloClientContentFul';
import ApolloClientContentService from '../../ApolloClientContentService';
import { logError } from '../../helper/Global';
import {
  setScreenSettings,
  setSplashLoading,
} from '../../slicers/screens/screenSlice';

const SCREEN_QUERY_API = gql`
  query GetScreens($limit: Int, $locale: String) {
    screensCollection(limit: $limit, locale: $locale) {
      items {
        screenName
        componentsCollection {
          items {
            componentName
            componentData
            config
          }
        }
      }
    }
  }
`;

export const getScreensAndSettings = async (
  { language, limit = 100 },
  dispatch
) => {
  let result;
  dispatch(setSplashLoading(true));
  try {
    result = await ApolloClientContentService.query({
      query: SCREEN_QUERY_API,
      variables: {
        limit,
        locale: language === 'ar' ? 'ar' : 'en-US',
      },
    });
    dispatch(setScreenSettings(result.data));
  } catch (e) {
    try {
      logError(e, {
        where: 'error with content service.. trying out with contentful',
      });
      result = await ApolloClientContentFul.query({
        query: SCREEN_QUERY_API,
        variables: {
          limit,
          locale: language === 'ar' ? 'ar' : 'en-US',
        },
      });
      dispatch(setScreenSettings(result.data));
    } catch (e) {
      logError(e);
    }
  }
  return result;
};
