import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import User from './User'

class NavBar extends Component {
  render () {
    const { access_token, name } = this.props
    let nameContent
    let linkContent
    if (name) {
      nameContent =
        <li className="grey darken-1">{name}</li>
      linkContent = <li><Link to="/">Sign Out</Link></li>
    } else {
      nameContent = <li></li>
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
  access_token: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  access_token: state.user ? state.user.access_token : '',
  name: state.user ? state.user.name : '',
})

export default connect(mapStateToProps, null)(NavBar)
