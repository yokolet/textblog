import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import User from './User'

class NavBar extends Component {
  render () {
    const { isAuthenticated } = this.props
    let linkContent
    if (isAuthenticated) {
      linkContent = <li><Link to="/">Sign Out</Link></li>
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

export default connect(mapStateToProps, null)(NavBar)
