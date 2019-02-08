import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { postsGql } from './queries'
import PropTypes from 'prop-types'
import { getPostList } from '../actions/get_post_list'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Pagination from './Pagination'

class PostList extends Component {
  constructor(props) {
    super(props)

    this.state = { errors: [] }
  }

  componentWillUpdate(nextProps) {
    if (this.props.data.loading && !nextProps.data.loading) {
      this.props.getPostList(nextProps.data)
      if (nextProps.data.error) {
        this.setState({
          errors: [
            ...this.state.errors,
            this.props.data.error.message
          ]
        })
      }
    }
    if (!this.props.data.loading && (this.props.cur !== nextProps.cur)) {
      this.props.getPostList(nextProps.data)
    }
  }

  excerpt = (content) => {
    let lines = content.split(/\n/)
    if (lines.length <= 5) {
      return content
    }
    return lines.slice(0, 5).join('\n')
  }

  renderPosts() {
    return this.props.posts.map(post => {
      return (
        <li key={post.id} className="collection-item">
          <div className="post-info">{post.user.name} posted at {post.updated_at}</div>
          <Link to={`posts/${post.id}`}>
            <div className="card">
              <div className="card-content">
                <span className="card-title">{post.title}</span>
                <div className="post-content"><pre>{this.excerpt(post.content)}</pre></div>
              </div>
            </div>
          </Link>
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
        <Link
          to="/posts/new"
          className="btn-floating btn-large teal darken-1 right"
        >
          <i className="material-icons">add</i>
        </Link>
        <ul className="collection">
          {this.renderPosts()}
        </ul>
        <Pagination/>
      </div>
    )
  }
}

const gqlWrapper = graphql(postsGql, {
  options: (props) => {
    return  { variables: { page: props.cur } }
  }
})

PostList.propTypes = {
  cur: PropTypes.number.isRequired,
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
  cur: state.pages.cur,
  posts: state.postList.posts,
})

const mapDispatchToProps = dispatch => ({
  getPostList: (data) => dispatch(getPostList(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(PostList)
