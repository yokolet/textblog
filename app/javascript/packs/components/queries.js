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

export const allPostsGql = gql`
  query {
    allPosts {
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