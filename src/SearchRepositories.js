import React from 'react'
import {gql, useQuery,useMutation} from '@apollo/client';
import { Buffer } from 'buffer';
import {TailSpin} from '@bit/mhnpd.react-loader-spinner.tail-spin';

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

export const ADD_STAR = gql`
  mutation addStar ($input: AddStarInput!) {
    addStar (input: $input) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

export const REMOVE_STAR = gql`
  mutation removeStar ($input: RemoveStarInput!) {
    removeStar(input: $input) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`



const SearchRepositories = props => {
  console.log(props.query)
   // GraphQL のクエリを実行
  const {loading, error, data, fetchMore, refetch} = useQuery(GET_REPOSITORIES, 
            {variables:
                { first: 10 ,
                  last:null,
                  query:props.query,
                  after:null,
                  before:null
                },
            },
            {fetchPolicy: "cache-and-network",}
            );

  //starをつける系の関数
  const [
    addStartRepositories,
    { loading: mutationAddStarLoading, error: mutationAddStarError }
  ] = useMutation(ADD_STAR, {
      onCompleted() {
        refetch();
      }
    }
  );

  const addStart = (nodeid) => {
    console.log("addStart start")
    console.log(nodeid)
    addStartRepositories({ variables: { input: { starrableId: nodeid } } , } );
    console.log("addStart end")
  }

  //starをはずす系の関数
  const [
    removeStartRepositories,
    { loading: mutationRemoveStarLoading, error: mutationRemoveStarError }
  ] = useMutation(REMOVE_STAR, {
    onCompleted() {
        refetch();
      }
    }
  );

  const removeStar = (nodeid) => {
    console.log("removeStar start")
    console.log(nodeid)
    removeStartRepositories({ variables: { input: { starrableId: nodeid } }, } );
    console.log("removeStar end")
  }






// クエリ実行中の表示（Loading)
  if (loading) return 	<TailSpin 
  color={"black"} 
  height={150} 
  width={150} 
  />;

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
        {mutationAddStarLoading && <p>Startを追加中です...</p>}
        {mutationAddStarError && <p>Startを追加に失敗しました : もう１度やり直してください</p>}  
        {mutationRemoveStarLoading && <p>Startを外しています...</p>}
        {mutationRemoveStarError && <p>Startを外すのに失敗しました : もう１度やり直してください</p>}  

        {
            //repository data view　
            search.edges.map(edge => {
                const node = edge.node
                return (
                    <li key={node.id}>
                    <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>

                    ☆{node.stargazers.totalCount}
                    {!node.viewerHasStarred && 
                    (
                    <button onClick={() => addStart(node.id)}>
                      スターをつける
                    </button>
                    )}

                    {node.viewerHasStarred && 
                    (
                    <button onClick={() => removeStar(node.id)}> 
                      スターを外す
                    </button>
                    )}
                    </li>
                )
                })
        }
        {hasNextPage && 
          (
            <button
                    onClick={async() =>
                      {
                        console.log("data get start");
                        await fetchMore({
                          variables: {
                            first: null ,
                            last:10,
                            query:props.query,
                            after: endCursor,
                            before:null
                          },
                        }, 
                        );
                        console.log("data get end");
                      }}
            >
              More 
            </button>
          )
        }
        {hasNextPage && 
          (
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
                    //単純な次のページのデータの場合      
                    return fetchMoreResult;
                    },
                })
              }
            >
              NextPage
            </button>
          )
        }

        {hasPreviousPage && 
          (
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
          )
        }
    </>
  )
};

export default SearchRepositories






