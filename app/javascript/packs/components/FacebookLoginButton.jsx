import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FacebookLogin from 'react-facebook-login'
import { updateFacebookLogin } from '../actions/update_facebook_login'

class FacebookLoginButton extends Component {
  responseFacebook = (response) => {
    this.props.updateFacebookLogin(response)
  }

  render() {
    const { access_token, prevPath } = this.props
    if (access_token) {
      return (
        <Redirect to={prevPath} />
      )
    } else {
      return (
        <FacebookLogin
          appId={process.env.FB_APP_ID}
          autoLoad={false}
          fields="id,name,email"
          callback={this.responseFacebook}
        />
      )
    }
  }
}

FacebookLoginButton.propTypes = {
  access_token: PropTypes.string,
  updateFacebookLogin: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
})
const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response))
})

export default connect(mapStateToProps, mapDispatchToProps)(FacebookLoginButton)