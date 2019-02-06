import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { currentPostGql } from './queries'
import { getPost } from '../actions/get_post'

class Post extends Component {
  componentWillUpdate(nextProps) {
    if (this.props.data.loading && !nextProps.data.loading) {
      this.props.getPost(nextProps.data)
    }
  }

  render() {
    let styles = {
      marginTop: '20px'
    }

    if (this.props.data.loading || this.props.post === null) {
      return <div>Loading...</div>
    }

    const { post, isAuthenticated, user_id } = this.props
    return (
      <div className="row" style={styles}>
        <div className="col s12 m12">
          <div className="card-panel white">
            <div className="post-info">{post.user.name} posted at {post.updated_at}</div>
            <div className="card">
              <div className="card-content">
                <span className="card-title">{post.title}</span>
                <div className="post-content"><pre>{post.content}</pre></div>
              </div>
            </div>
            { (isAuthenticated && user_id === post.user.id) &&
              <div>
                <a className="waves-effect waves-light btn pink darken-1 left"><i className="material-icons right">delete</i>delete</a>
                <a className="waves-effect waves-light btn right"><i className="material-icons right">create</i>edit</a>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const gqlWrapper = graphql(currentPostGql, {
    options: (props) => {
      return { variables: { id: props.match.params.id } }
  }
})

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      provider: PropTypes.string.isRequired,
    })
  }),
  isAuthenticated: PropTypes.bool,
  getPost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.serverLogin.isAuthenticated,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : undefined,
  post: state.currentPost.post
})

const mapDispatchToProps = dispatch => ({
  getPost: (data) => dispatch(getPost(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(Post)
