import * as React from 'react';
import {gql, useQuery} from '@apollo/client';

// 発行する GraphQL クエリ
const GET_ISSUES = gql`
  query {
    search(query: "repo:apollographql/apollo is:issue", type: ISSUE, first: 5) {
      issueCount
      nodes {
        ... on Issue { number title }
      }
    }
  }
`;

export const Issues: React.FC = () => {
  // GraphQL のクエリを実行
  const {loading, error, data} = useQuery(GET_ISSUES);

  // クエリ実行中の表示
  if (loading) return <p>Loading ...</p>;

  // エラー発生時（レスポンスがないとき）の表示
  if (error) return <p style={{color: 'red'}}>{error.message}</p>;

  // クエリの結果が返ってきたときの表示
  const {issueCount, nodes: issues} = data.search;
  return <>
    <h2>Num of issues: {issueCount}</h2>
    <ul>
      { issues.map(i => <li key={i.number}>{i.number} - {i.title}</li>) }
    </ul>
  </>;
};