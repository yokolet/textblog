import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql } from 'react-apollo'
import PostForm from './PostForm'
import { addPost } from '../actions/add_post'
import { setCurrentPage } from '../actions/set_pages'
import { updateFacebookLogin} from '../actions/update_facebook_login'
import { updateServerLogin} from '../actions/update_server_login'
import { postsGql, addPostGql, pagesGql } from './queries'

class AddPostForm extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = { errors: []}
  }

  onSubmit = ({ title, content }) => {
    const { mutate, provider, access_token, addPost, setCurrentPage } = this.props
    mutate({
      variables: { provider, title: title, content: content },
      context: { headers: { authorization: `Bearer ${access_token}` } },
      refetchQueries: [
        { query: pagesGql },
        { query: postsGql, variables: { page: 1 } }
        ]
    })
      .then(({ data }) => {
        // this data holds the result of mutate only
        addPost(data)
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
    const { isAuthenticated } = this.props

    return (
      <PostForm
        isAuthenticated={isAuthenticated}
        type="Add"
        title=""
        content=""
        onSubmit={this.onSubmit}
      />
    )
  }
}

const gqlWrapper = graphql(addPostGql)

AddPostForm.propTypes = {
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  addPost: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  addPost: (data) => dispatch(addPost(data)),
  setCurrentPage: (cur) => dispatch(setCurrentPage(cur)),
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (data) => dispatch(updateServerLogin(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(AddPostForm)
