import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { updateFacebookLogin } from '../actions/update_facebook_login'
import { updateServerLogin } from '../actions/update_server_login'
import { signInUserGql } from './queries'

class User extends Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    this.state = { errors: [] }
  }

  componentDidMount() {
    const { access_token, isAuthenticated, updateFacebookLogin, updateServerLogin } = this.props
    if (window.localStorage.getItem("_textblog_.socialLogin") && access_token === null) {
      updateFacebookLogin(JSON.parse(window.localStorage.getItem("_textblog_.socialLogin")))
    }
    if (window.localStorage.getItem("_textblog_.serverLogin") && isAuthenticated === false) {
      updateServerLogin(JSON.parse(window.localStorage.getItem("_textblog_.serverLogin")))
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.handleLoad()
  }

  handleLoad() {
    const { access_token, isAuthenticated } = this.props

    if (access_token && isAuthenticated === false) {
      const { mutate, provider, updateFacebookLogin, updateServerLogin } = this.props
      mutate({
        variables: { provider },
        context: { headers: { authorization: `Bearer ${access_token}` } }
      })
        .then(({ data }) => {
          updateServerLogin(data)
          const { user_id, name } = this.props
          window.localStorage.setItem(
            "_textblog_.socialLogin",
            JSON.stringify({ provider, accessToken: access_token }))
          window.localStorage.setItem(
            "_textblog_.serverLogin",
            JSON.stringify({ signInUser: { id: user_id, name, provider } }))
        })
        .catch(res => {
          if (res.graphQLErrors) {
            let errors = res.graphQLErrors.map(error => error.message)
            this.setState({ errors })
            window.localStorage.removeItem("_textblog_.socialLogin")
            window.localStorage.removeItem("_textblog_.serverLogin")
            updateFacebookLogin({})
            updateServerLogin({})
            M.toast({html: errors.toString()})
          }
        })
    }
  }

  render () {
    let name_style = {
      backgroundColor: '#3a4f59'
    }
    const { provider, access_token, user_id, name } = this.props
    if (this.props.isAuthenticated) {
      return (
        <li key={user_id} style={name_style}><i className="material-icons left">person</i>{name}</li>
      )
    } else {
      return (
        <li></li>
      )
    }
  }
}

const gqlWrapper = graphql(signInUserGql)

User.propTypes = {
  isAuthenticated: PropTypes.bool,
  access_token: PropTypes.string,
  name: PropTypes.string.isRequired,
  user_id: PropTypes.string,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : '',
  name: state.serverLogin.user ? state.serverLogin.user.name : '',
  isAuthenticated: state.serverLogin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (user) => dispatch(updateServerLogin(user))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(User)
