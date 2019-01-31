import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { allPostsGql } from './queries'
import PropTypes from "prop-types";
import { getPostList } from "../actions/get_post_list";
import { connect } from "react-redux";
import { compose } from "redux";

class PostList extends Component {
  constructor(props) {
    super(props)

    this.state = { errors: [] }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.data.allPosts && this.props.data.allPosts) {
      this.props.getPostList(this.props.data)
    }
    if (!prevProps.data.error && this.props.data.error) {
      this.setState({
        errors: [
          ...this.state.errors,
          this.props.data.error.message
        ]
      })
    }
  }

  renderPosts() {
    return this.props.posts.map(post => {
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

const gqlWrapper = graphql(allPostsGql)

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    }).isRequired,
  ),
  getPostList: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  posts: state.postList.posts,
})

const mapDispatchToProps = dispatch => ({
  getPostList: (data) => dispatch(getPostList(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(PostList)
