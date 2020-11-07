import React , { useState }from 'react';
import {ApolloProvider} from '@apollo/client';
import client from './client'
//import {Issues} from './Issues';
import SearchRepositories from './SearchRepositories';

function App() {
  const intialState = {
    beforeQuery:'graphq',
    procQuery:'graphq'
  }

  const [state, setState] = useState(intialState)

  const changeQuery = e => {
    e.preventDefault()
    console.log(state.beforeQuery)
    console.log(state.procQuery)
    setState({...state,procQuery:state.beforeQuery})
  }

  return (
      <>
    <div className="App">
          <p>
                {state.beforeQuery}のリポジトリ一覧
          </p>
          <input id="query" type="text" value={state.beforeQuery} onChange={(e) => setState({...state,beforeQuery:e.target.value})}/>
          <button onClick={changeQuery}  >
            検索
          </button>
    </div>
    <ApolloProvider client={client}>

      <SearchRepositories query={state.procQuery}/>

    </ApolloProvider>
    </>    
  );
}

export default App;
