import React from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './client'
import {Issues} from './Issues';


function App() {
  return (
      <>
    <div className="App">
          hello,world
    </div>
    <ApolloProvider client={client}>
      <Issues />
    </ApolloProvider>
    </>    
  );
}

export default App;
