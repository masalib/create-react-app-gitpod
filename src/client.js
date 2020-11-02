import {ApolloClient, InMemoryCache} from '@apollo/client';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN
console.log(GITHUB_TOKEN)

// GraphQL クライアントを生成
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {authorization: `Bearer ${GITHUB_TOKEN}`},
  cache: new InMemoryCache(),
});


export default client;