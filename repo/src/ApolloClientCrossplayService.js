import { ApolloClient, InMemoryCache } from '@apollo/client';
import { env } from './src/config/env';
const ApolloClientCrossplayService = new ApolloClient({
  // uri: `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/explore?access_token=${CDA_ACCESS_TOKEN}`,

  cache: new InMemoryCache(),

  environment: 'Development',
  uri: () => {
    // const uri = `http://localhost:8080/graphql`;
    const uri = env.CROSSPLAY_SERVICE_GRAPHQL_ENDPOINT;
    //'https://dev-crossplay-service.danubehome.com/graphql'; //`http://localhost:8080/graphql`;

    return uri;
  },
});
export default ApolloClientCrossplayService;

// const uri = 'https://dev-crossplay-service.danubehome.com/graphql'; //`http://localhost:8080/graphql`;
