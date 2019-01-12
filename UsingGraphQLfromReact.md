# Using GraphQL from React

This document explains steps to use GraphQL from React.
When all steps in this document are completed, the entire repository will look like this
__[textblog repo](https://github.com/yokolet/textblog/tree/3811498301677c27d7eca1d111adefa7c2834c53)__.


As in the [Adding React](AddingReact.md), React was installed by webpacker.
The code resides in the directory, `app/javascript/packs`.

1. Install Apollo client

    To use GraphQL from React, a client app needs a library to wrap HTTP request.
    There exist a couple of well-used choices such as [lokka](https://github.com/kadirahq/lokka),
    [Relay](https://facebook.github.io/relay/), and [Apollo client](https://www.apollographql.com/docs/react/).

    Among those three, Apollo client is a good choice since it has a rich set of features but
    not complicated. Apollo client is one of layers that Apollo full-stack framework provides.
    This is a Rails app, so only Apollo client will be used here.
    
    Add packages as in below:

    ```bash
    yarn add apollo-boost react-apollo graphql-tag graphql
    ```

2. Wrap React component

    So far, this app has only one `Hello` component which is defined in `app/javascript/packs/hello_react.jsx`.
    Wrap this component by `ApolloProvider`. The endpoint to create `ApolloClient` is `/graphql`,
    which was create by graphql-ruby gem.
    
    ```javascript
    import ApolloClient from 'apollo-boost'
    import { ApolloProvider } from 'react-apollo'
 
    const client = new ApolloClient({uri: window.location.origin + "/graphql"});
 
    const Hello = props => {
      return (
          <ApolloProvider client={client}>
            <div>Hello {props.name}!</div>
          </ApolloProvider>
      )
    }
    ```

3. Check nothing is broken

    At this point, the React component does nothing of GraphQL. However, it's a good time
    to check ApolloProvider doesn't harm any. The React app is setup to run at
    `http://localhost:3000`, which was done in [AddingReact](./AddingReact.md).
    
    Open browser and go to `http://localhost:3000`.
    
    It may take a while to compile. When the app is ready, "Hello React!" should show up.

4. Write GraphQL query in a component

    Two users have been created by `rails db/seed`, which was explained in
    [Getting Started](./GettingStarted.md). To make a GraphQL query to those users,
    let's add a new component `UserList`. Following React convention, first make a directory,
    `app/javascript/packs/components` then create a file `UserList.jsx` in there. The file is:
    
    ```javascript
    import React, { Component } from 'react'
    import gql from 'graphql-tag'
    import { graphql } from 'react-apollo'
    
    class UserList extends Component {
        renderUsers() {
            return this.props.data.allUsers.map(user => {
                return (
                    <li key={user.id}>
                    {user.name} - {user.email}
                    </li>
                )
            })
        }
        render() {
            if (this.props.data.loading) {
                return <div>Loading...</div>
            }
            return (
                <ul>
                {this.renderUsers()}
                </ul>
            )
        }
    }
    
    const query = gql`
      {
        allUsers {
          id
          name
          email
        }
      }
    `
    
    export default graphql(query)(UserList);  // higher order function call
    ```
    The query is exactly the same one tested on GraphiQL.

5. Add UserList component

    Next will be to add UserList component in `hello-react.jsx`. Import component and
    add `<UserList />` inside of `ApolloProvider`.
    
    ```javascript
    import UserList from './components/UserList'
 
    const Hello = props => {
      return (
          <ApolloProvider client={client}>
            <div>Hello {props.name}!</div>
            <UserList />
          </ApolloProvider>
      )
    }
    ```

6. Modify controller

    This Rails app was not created as API server, but GraphQL query/mutation are API calls.
    Calling GraphQL endpoint causes the error, `Can't verify CSRF token authenticity.`
    
    Add one line, `skip_before_action :verify_authenticity_token` to the top of `graphql_controller.rb`
    
    ```ruby
    class GraphqlController < ApplicationController
      skip_before_action :verify_authenticity_token
    
      def execute
    ```

7. Test GraphQL query

    Everything is set up. It's time ti test GraphQL query.
    Assuming Rails server is up and running, go to the browser and reload
    `http://localhost:3000/`. A list of users should show up.
    
For now, textblog app was confirmed to work with GraphQL query from React.
Next topic is about [Adding OAuth](./AddingOAuth.md).
