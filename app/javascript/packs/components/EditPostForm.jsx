import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql } from "react-apollo";
import PostForm from './PostForm'
import { getPost } from '../actions/get_post'
import { updatePost } from '../actions/update_post'
import { setCurrentPage } from '../actions/set_pages'
import { updateFacebookLogin} from '../actions/update_facebook_login'
import { updateServerLogin} from '../actions/update_server_login'
import { postsGql, updatePostGql, pagesGql, currentPostGql } from './queries'

class EditPostForm extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = { error: null }
  }

  componentWillUpdate(nextProps) {
    if (this.props.post) {
      return
    }
    if (this.props.data.loading && !nextProps.data.loading) {
      if (nextProps.data.error) {
        this.setState({ error: nextProps.data.error.message })
      } else {
        this.props.getPost(nextProps.data)
      }
    }
  }

  onSubmit = ({ title, content }) => {
    const {
      mutate, provider, access_token, post,
      updatePost, setCurrentPage
    } = this.props
    mutate({
      variables: { provider, post_id: post.id, title: title, content: content },
      context: { headers: { authorization: `Bearer ${access_token}` } },
      refetchQueries: [
        { query: pagesGql },  // it would be a good chance to catch up updates by other users
        { query: postsGql, variables: { page: 1 } }
        ]
    })
      .then(({ data }) => {
        updatePost(data)
        setCurrentPage(1)

        this.props.history.push('/')
      })
      .catch(res => {
        if (res.graphQLErrors) {
          let errors = res.graphQLErrors.map(error => error.message)
          this.setState({ errors })
          if (res.graphQLErrors.map(error => error.type).includes('OAuthError')) {
            window.localStorage.removeItem("_textblog_.socialLogin")
            window.localStorage.removeItem("_textblog_.serverLogin")
            this.props.updateFacebookLogin({})
            this.props.updateServerLogin({})
          }
          M.toast({html: errors.toString()})
        }
      })
  }

  render() {
    if (this.state.error != null) {
      return <div>{this.state.error}</div>
    }

    if (this.props.data.loading || this.props.post === null) {
      return <div>Loading...</div>
    }

    const { isAuthenticated, post } = this.props
    let styles = {
      marginTop: '20px'
    }
    return (
      <PostForm
        isAuthenticated={isAuthenticated}
        title={post.title}
        content={post.content}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const updatePostGqlWrapper = graphql(updatePostGql)
const currentPostGqlWrapper = graphql(currentPostGql, {
  options: (props) => {
    return { variables: { id: props.match.params.id } }
  }
})

EditPostForm.propTypes = {
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool,
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
  getPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated,
  post: state.currentPost.post
})

const mapDispatchToProps = dispatch => ({
  getPost: (data) => dispatch(getPost(data)),
  updatePost: (data) => dispatch(updatePost(data)),
  setCurrentPage: (cur) => dispatch(setCurrentPage(cur)),
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (data) => dispatch(updateServerLogin(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)

export default compose(updatePostGqlWrapper, currentPostGqlWrapper, reduxWrapper)(EditPostForm)
