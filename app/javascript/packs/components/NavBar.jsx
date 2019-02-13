import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import User from './User'
import { updateServerLogin } from "../actions/update_server_login";
import { updateFacebookLogin } from "../actions/update_facebook_login";

class NavBar extends Component {
  onSignoutClick() {
    this.props.updateFacebookLogin({})
    this.props.updateServerLogin({})
    window.localStorage.removeItem("_textblog_.socialLogin")
    window.localStorage.removeItem("_textblog_.serverLogin")
  }

  render () {
    const { location, isAuthenticated } = this.props
    let backLink
    if (location.pathname === "/") {
      backLink = <div id="logo-container" className="brand-logo left">textblog</div>
    } else {
      let style = { marginRight: '0px' }
      backLink =
        <Link to="/" className="grey-text text-darken-3 left">
          <i className="material-icons left" style={style}>arrow_back_ios</i>Top
        </Link>
    }
    let linkContent
    if (isAuthenticated) {
      linkContent = <a onClick={this.onSignoutClick.bind(this)}>Sign Out</a>
    } else {
      linkContent = <Link to={{pathname: "/sign_in", state: {prevPath: location.pathname}}}>Sign In</Link>
    }
    return (
      <div className="navbar-fixed">
        <nav className="white">
          <div className="nav-wrapper container">
            {backLink}
            <ul id="nav-mobile" className="right">
              <User/>
              <li>
                {linkContent}
              </li>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))