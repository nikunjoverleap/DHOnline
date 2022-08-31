import { ApolloClient, InMemoryCache } from '@apollo/client';
const SPACE_ID = '058vu9hqon0j';
const CDA_ACCESS_TOKEN = 'ZYDUMaup5K4NhaC_c2J4i0t_vfq36eQ1MlXGsobefhM';
const ApolloClientContentFul = new ApolloClient({
  // uri: `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/explore?access_token=${CDA_ACCESS_TOKEN}`,

  cache: new InMemoryCache(),

  uri: () => {
    return `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/Dev`;
  },

  credentials: 'same-origin',
  headers: {
    Authorization: `Bearer ${CDA_ACCESS_TOKEN}`,
  },
  // }
});
export default ApolloClientContentFul;
