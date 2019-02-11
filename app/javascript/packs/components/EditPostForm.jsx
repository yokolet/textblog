import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql } from "react-apollo";
import PostForm from './PostForm'
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.loading && !this.props.data.loading) {
      if (this.props.data.error) {
        this.setState({ error: this.props.data.error.message })
      }
    }
  }

  onSubmit = ({ title, content }) => {
    const {
      mutate, provider, access_token,
      updatePost, setCurrentPage
    } = this.props
    const { post } = this.props.data
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
          this.setState({ error: errors.toString() })
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
    if (this.props.data.loading) {
      return <div>Loading...</div>
    }

    if (this.state.error != null) {
      return <div>{this.state.error}</div>
    }

    if (!this.props.data.post) {
      return <div>Loading...</div>
    }

    const { isAuthenticated } = this.props
    const { post } = this.props.data
    let styles = {
      marginTop: '20px'
    }
    return (
      <PostForm
        isAuthenticated={isAuthenticated}
        type="Edit"
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
  isAuthenticated: PropTypes.bool.isRequired,
  updatePost: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated,
})

const mapDispatchToProps = dispatch => ({
  updatePost: (data) => dispatch(updatePost(data)),
  setCurrentPage: (cur) => dispatch(setCurrentPage(cur)),
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (data) => dispatch(updateServerLogin(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)

export default compose(updatePostGqlWrapper, currentPostGqlWrapper, reduxWrapper)(EditPostForm)
