import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './client'
import {Issues} from './Issues';
import SearchRepositories from './SearchRepositories';

function App() {
  let query ='graphql'
  return (
      <>
    <div className="App">
          hello,world
    </div>
    <ApolloProvider client={client}>
      <Issues />

      <SearchRepositories query={query}/>

    </ApolloProvider>
    </>    
  );
}

export default App;
