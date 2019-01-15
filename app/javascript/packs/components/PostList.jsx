import React, { Component } from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class PostList extends Component {
  renderPosts() {
    return this.props.data.allPosts.map(post => {
      return (
        <li key={post.id} className="collection-item">
          <div className="post-info">{post.user.name} posted at {post.updated_at}</div>
          <div className="card">
            <div className="card-content">
              <span className="card-title">{post.title}</span>
              <div className="post-content">{post.content}</div>
            </div>
          </div>
        </li>
      )
    })
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>
    }
    return (
      <div>
        <ul className="collection">
          {this.renderPosts()}
        </ul>
      </div>
    )
  }
}

const query = gql`
  {
    allPosts {
      id
      title
      content
      updated_at
      user {
        name
      }
    }
  }
`

export default graphql(query)(PostList)