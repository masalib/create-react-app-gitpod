import {ApolloClient, InMemoryCache} from '@apollo/client';
import { relayStylePagination  } from "@apollo/client/utilities";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN
console.log(GITHUB_TOKEN)

// GraphQL クライアントを生成
const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: relayStylePagination (["query"]),
      },
    },
  },
});


const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {authorization: `Bearer ${GITHUB_TOKEN}`},
  cache: cache,
});


export default client;