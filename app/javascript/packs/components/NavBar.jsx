import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NavBar extends Component {
  render () {
    return (
      <div className="navbar-fixed">
        <nav className="white">
          <div className="nav-wrapper container">
            <Link id="logo-container" to="/" className="brand-logo left">textblog</Link>
            <ul id="nav-mobile" className="right">
              <li><Link to="/sign_in">Sign In</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default NavBar