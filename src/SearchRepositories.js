import React from 'react'
import {gql, useQuery} from '@apollo/client';

// 発行する GraphQL クエリ
const GET_REPOSITORIES = gql`
  query searchRepositories($count: Int,$query: String!){
    search(query: $query, type: REPOSITORY, first: $count) {
      repositoryCount
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

const SearchRepositories = () => {
  // GraphQL のクエリを実行
  const {loading, error, data} = useQuery(GET_REPOSITORIES, {variables: { count: 10 ,query:'GraphQL'},}  );

  // クエリ実行中の表示
  if (loading) return <p>Loading ...</p>;

  // エラー発生時（レスポンスがないとき）の表示
  if (error) return <p style={{color: 'red'}}>{error.message}</p>;

  // クエリの結果が返ってきたときの表示
  const {repositoryCount} = data.search;
  const search = data.search

  return (
    <>
        <h2>SearchRepositories: {repositoryCount}</h2>
        {
        search.edges.map(edge => {
            const node = edge.node
            return (
                <li key={node.id}>
                <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                </li>
            )
            })
        }              
    </>
  )
};

export default SearchRepositories

