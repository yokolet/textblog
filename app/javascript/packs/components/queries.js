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