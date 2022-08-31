import { ApolloClient, InMemoryCache } from '@apollo/client';
import { env } from './src/config/env';
const ApolloClientContentService = new ApolloClient({
  // uri: `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/explore?access_token=${CDA_ACCESS_TOKEN}`,

  cache: new InMemoryCache(),
  environment: 'Development',
  //uri: `http://localhost:4002/graphql`,
  // uri: `https://staging-content-service.danubehome.com/graphql`,
  uri: env.CONTENT_SERVICE_GRAPHQL_ENDPOINT,
  // }
});
export default ApolloClientContentService;
