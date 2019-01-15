import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import App from './components/App'

const client = new ApolloClient({uri: window.location.origin + "/graphql"});

const Root = props => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.body.appendChild(document.createElement('div')),
  )
})
