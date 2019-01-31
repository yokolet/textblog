import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import User from './User'
import { updateServerLogin } from "../actions/update_server_login";
import { updateFacebookLogin } from "../actions/update_facebook_login";

class NavBar extends Component {
  onSignoutClick() {
    this.props.updateFacebookLogin({})
    this.props.updateServerLogin({})
  }

  render () {
    const { isAuthenticated } = this.props
    let linkContent
    if (isAuthenticated) {
      linkContent = <li><a onClick={this.onSignoutClick.bind(this)}>Sign Out</a></li>
    } else {
      linkContent = <li><Link to="/sign_in">Sign In</Link></li>
    }
    return (
      <div className="navbar-fixed">
        <nav className="white">
          <div className="nav-wrapper container">
            <Link id="logo-container" to="/" className="brand-logo left">textblog</Link>
            <ul id="nav-mobile" className="right">
              <User/>
              {linkContent}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.serverLogin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (user) => dispatch(updateServerLogin(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
