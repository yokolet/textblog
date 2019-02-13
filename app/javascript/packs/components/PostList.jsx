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

    this.excerpt = this.excerpt.bind(this)
    this.state = { errors: [] }
  }

  areEqualPosts = (posts1, posts2) => {
    if (posts1.length !== posts2.length) { return false }
    let ids1 = posts1.map(post => post.id)
    let ids2 = posts2.map(post => post.id)
    return Array.from(ids1, (x, i) => x - ids2[i]).every(v => v === 0)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.props.getPostList(this.props.data)
      if (this.props.data.error) {
        this.setState({
          errors: [
            ...this.state.errors,
            this.props.data.error.message
          ]
        })
      }
      return
    }

    // edit, delete, or add post is performed
    // refetchQueries and refetch pull out updated posts which are in nextProps
    // when the first page's first post was edited, areEqualPosts check passes through
    if (!this.props.data.loading && this.props.data.posts) {
      if (!this.areEqualPosts(this.props.data.posts, prevProps.data.posts) ||
        (this.props.data.posts[0].title !== prevProps.data.posts[0].title) ||
        (this.props.data.posts[0].content !== prevProps.data.posts[0].content)) {
        this.props.getPostList(this.props.data)
      }
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
          <div className="post-info">
            <span className="post-info-name">{post.user.name}</span>
            <span className="post-info-time">@{post.updated_at}</span>
          </div>
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

    let add_style = {
      backgroundColor: '#f3ae93'
    }
    return (
      <div>
        <Link
          to="/posts/new"
          className="btn-floating btn-large right"
          style={add_style}
        >
          <i className="material-icons">add</i>
        </Link>
        {this.state.errors.length !== 0 ? (
          <div>{this.state.errors.toString()}</div>
        ) : (
          <ul className="collection">
            {this.renderPosts()}
          </ul>
        )}
        <Pagination fetchMore={this.props.data.fetchMore}/>
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
  posts: state.postList.posts
})

const mapDispatchToProps = dispatch => ({
  getPostList: (data) => dispatch(getPostList(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(PostList)
