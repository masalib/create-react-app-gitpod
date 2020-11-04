import React from 'react'
import {gql, useQuery} from '@apollo/client';
import { Buffer } from 'buffer';

// 発行する GraphQL クエリ
const GET_REPOSITORIES = gql`
  query searchRepositories($first: Int,$last: Int,$query: String!,$after:String,$before:String, ){
    search(query: $query, type: REPOSITORY, first: $first, last: $last, after:$after,before:$before) {
      repositoryCount
      pageInfo{
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            id
            name
            url
            stargazers {
              totalCount
            }
            viewerHasStarred
          }
        }
      }
      }
  }
`;

const SearchRepositories = props => {
  console.log(props.query)
   // GraphQL のクエリを実行
  const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES, 
            {variables:
                { first: 10 ,
                  last:null,
                  query:props.query,
                  after:null,
                  before:null
                },
            });

  // クエリ実行中の表示
  if (loading) return <p>Loading ...</p>;

  // エラー発生時（レスポンスがないとき）の表示
  if (error) return <p style={{color: 'red'}}>{error.message}</p>;

  // クエリの結果が返ってきたときの表示
  const {repositoryCount} = data.search;
  const search = data.search
  const {hasNextPage,hasPreviousPage,endCursor,startCursor} = data.search.pageInfo
  console.log(hasNextPage)
  console.log(hasPreviousPage)
  console.log(Buffer.from(startCursor, 'base64').toString())
  console.log(Buffer.from(endCursor, 'base64').toString())

  return (
    <>
        <h2>SearchRepositories: {repositoryCount}</h2>
        {
            //repository data view　
            search.edges.map(edge => {
                const node = edge.node
                return (
                    <li key={node.id}>
                    <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                    </li>
                )
                })
        }

        {hasNextPage && (
            <button
                    onClick={() =>
                       fetchMore({
                            variables: {
                                first: 10 ,
                                last:null,
                                query:props.query,
                                after: endCursor,
                            before:null
                          },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                            //more パターン
                            /*
                            fetchMoreResult.search.edges = [
                                ...prevResult.search.edges,
                                ...fetchMoreResult.search.edges
                            ];
                            return fetchMoreResult;
                            */

                            //単純な次のページのデータの場合      
                            return fetchMoreResult;
                            },
                        })
                    }
            >
                NextPage
            </button>

        )}
        {hasPreviousPage && (
            <button
                    onClick={() =>
                       fetchMore({
                            variables: {
                                first: null ,
                                last:10,
                                query:props.query,
                                after: null,
                            before:startCursor
                          },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                            //単純な次のページのデータの場合      
                            return fetchMoreResult;
                            },
                        })
                    }
            >
                PreviousPage
            </button>


        )}

        

    </>
  )
};

export default SearchRepositories

