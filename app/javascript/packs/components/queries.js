import gql from 'graphql-tag'

export const signInUserGql = gql`
  mutation SignInUser($provider: String!) {
    signInUser(provider: $provider) {
      id
      provider
      name
    }
  }
`

export const postsGql = gql`
  query Posts($page: Int!) {
    posts(page: $page) {
      id
      title
      content
      updated_at
      user {
        id
        name
      }
    }
  }
`

export const currentPostGql = gql`
  query CurrentPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      updated_at
      user {
        id
        name
        provider
      }
    }
  }
`

export const addPostGql = gql`
  mutation AddPost($provider: String!, $title: String!, $content: String!) {
    addPost(provider: $provider, title: $title, content: $content) {
      id
      title
      content
      updated_at
      user {
        id
        name
      }
    }
  }
`

export const deletePostGql = gql`
  mutation DeletePost(
    $provider: String!,
    $post_id: ID!)
  {
    deletePost(
      provider: $provider,
      post_id: $post_id
    )
  }
`

export const updatePostGql = gql`
  mutation UpdatePost(
    $provider: String!,
    $post_id: ID!,
    $title: String!,
    $content: String!)
    {
      updatePost(
        provider: $provider,
        post_id: $post_id,
        title: $title,
        content: $content
      )
    }
`

export const pagesGql = gql`
  query {
    pages {
      per
      last
    }
  }
`