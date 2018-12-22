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
