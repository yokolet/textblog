import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import App from './components/App'
import reducer from './reducers'

const client = new ApolloClient({uri: window.location.origin + "/graphql"});

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}
const store = createStore(reducer, applyMiddleware(logger))

const Root = props => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router><App /></Router>
      </Provider>
    </ApolloProvider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.body.appendChild(document.createElement('div')),
  )
})
