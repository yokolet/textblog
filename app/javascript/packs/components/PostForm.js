import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql } from "react-apollo";
import { addPost } from '../actions/add_post'
import { setCurrentPage } from '../actions/set_pages'
import { updateFacebookLogin} from '../actions/update_facebook_login'
import { updateServerLogin} from '../actions/update_server_login'
import { postsGql, addPostGql, pagesGql } from './queries'

class PostForm extends Component {
  constructor(props) {
    super(props)

    this.state = { title: '', content: '', errors: []}
  }

  onSubmit(event) {
    event.preventDefault()

    let goodTitle = false
    let goodContent = false
    if (this.state.title.length < 1) {
      M.toast({html: 'Title should not be empty '})
    } else if (this.state.title.length > 50) {
      M.toast({html: 'Title length should be <= 50'})
    } else {
      goodTitle = true
    }
    if (this.state.content < 1) {
      M.toast({html: 'Content should not be empty '})
    } else if (this.state.content.length > 5000) {
      M.toast({html: 'Content length should be <= 5000'})
    } else {
      goodContent = true
    }

    if (goodTitle && goodContent) {
      const { mutate, provider, access_token, addPost, setCurrentPage } = this.props
      mutate({
        variables: { provider, title: this.state.title, content: this.state.content },
        context: { headers: { authorization: `Bearer ${access_token}` } },
        refetchQueries: [
          { query: pagesGql },
          { query: postsGql, variables: { page: 1 } }
          ]
      })
        .then(({ data }) => {
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
  }

  render() {
    const { isAuthenticated } = this.props
    let styles = {
      marginTop: '20px'
    }
    return (
      <div className="row" style={styles}>
        <div className="col s12 m12">
          <div className="card-panel white">
            {isAuthenticated ? (
              <form onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="title"
                      type="text"
                      className="validate"
                      onChange={e => this.setState({ title: e.target.value })}
                    />
                    <label htmlFor="title">Title</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <textarea
                      id="content"
                      className="materialize-textarea"
                      onChange={e => this.setState({ content: e.target.value })}
                    ></textarea>
                    <label htmlFor="content">Content</label>
                  </div>
                </div>
                <div className="row">
                  <button className="btn waves-effect waves-light right" type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flow-text center">Please Sign In to Post</div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const addPostGqlWrapper = graphql(addPostGql)
const pagesGqlWrapper = graphql(pagesGql)

PostForm.propTypes = {
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

export default compose(pagesGqlWrapper, addPostGqlWrapper, reduxWrapper)(PostForm)
