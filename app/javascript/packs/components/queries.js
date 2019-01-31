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