import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { addCommentGql, commentsGql } from './queries'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { updateFacebookLogin } from '../actions/update_facebook_login'
import { updateServerLogin } from '../actions/update_server_login'

class CommentForm extends Component {
  constructor(props) {
    super(props)
    this.onClickAdd = this.onClickAdd.bind(this)
    this.onClickCancel = this.onClickCancel.bind(this)
    this.state = { body: '', errors: [] }
  }

  onClickAdd = (event) => {
    event.preventDefault()
    console.log(event)

    if (this.state.body.length < 1) {
      M.toast({html: 'Comment should not be empty '})
    } else if (this.state.body.length > 255) {
      M.toast({html: 'Comment length should be <= 255'})
    } else {
      const {
        post_id, provider, access_token,
        mutate, hideCommentForm, updateFacebookLogin, updateServerLogin
      } = this.props
      mutate({
        variables: { provider, post_id: post_id, body: this.state.body },
        context: { headers: { authorization: `Bearer ${access_token}` } },
        refetchQueries: [
          { query: commentsGql, variables: { post_id: post_id } }
        ]
      })
        .then(({ data }) => {
          console.log("after mutation", data)
          this.setState({
            ...this.state,
            body: ''
          })
          hideCommentForm()
        })
        .catch(res => {
          if (res.graphQLErrors) {
            let errors = res.graphQLErrors.map(error => error.message)
            this.setState({
              ...this.state,
              errors
            })
            if (res.graphQLErrors.map(error => error.type).includes('OAuthError')) {
              window.localStorage.removeItem("_textblog_.socialLogin")
              window.localStorage.removeItem("_textblog_.serverLogin")
              updateFacebookLogin({})
              updateServerLogin({})
            }
            M.toast({html: errors.toString()})
          }
        })
    }
  }

  onClickCancel = (event) => {
    event.preventDefault()

    this.setState({
      ...this.state,
      body: ''
    })
    this.props.hideCommentForm()
  }

  render() {
    const display = {
      display: 'block',
    }

    const hide = {
      display: 'none',
    }

    return (
      <div className="row" style={this.props.showForm ? display : hide}>
        <div className="col s12 m12">
          <form>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="comment"
                  type="text"
                  className="validate"
                  value={this.state.body}
                  onChange={e => this.setState({ body: e.target.value })}
                />
                <label className="active" htmlFor="comment">Comment</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12 m12">
                <button
                  className="btn waves-effect waves-light grey left"
                  type="submit"
                  name="action"
                  onClick={e => this.onClickCancel(e)}
                >
                  Cancel
                </button>
                <button
                  className="btn waves-effect waves-light right"
                  type="submit"
                  name="action"
                  onClick={e => this.onClickAdd(e)}
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const gqlWrapper = graphql(addCommentGql)

CommentForm.propTypes = {
  post_id: PropTypes.string.isRequired,
  provider: PropTypes.string,
  access_token: PropTypes.string,
  showForm: PropTypes.bool.isRequired,
  hideCommentForm: PropTypes.func.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
})

const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (data) => dispatch(updateServerLogin(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(CommentForm)
