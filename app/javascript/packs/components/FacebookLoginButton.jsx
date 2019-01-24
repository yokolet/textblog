import React, { Component } from 'react'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import { updateFacebookLogin } from '../actions/update_facebook_login'

class FacebookLoginButton extends Component {
  responseFacebook = (response) => {
    this.props.updateFacebookLogin(response)
  }

  render() {
    const { access_token } = this.props
    if (access_token) {
      return (
        <Redirect to="/" />
      )
    } else {
      return (
        <FacebookLogin
          appId={process.env.FB_APP_ID}
          autoLoad={true}
          fields="id,name,email"
          callback={this.responseFacebook}
        />
      )
    }
  }
}

FacebookLoginButton.propTypes = {
  access_token: PropTypes.string.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  access_token: state.socialLogin.user ? state.socialLogin.user.access_token : '',
})
const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response))
})

export default connect(mapStateToProps, mapDispatchToProps)(FacebookLoginButton)