import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import PostList from './PostList'

const App = () => (
  <Router>
    <div>
      <NavBar />
      <div className="container">
        <Route exact path="/" component={PostList} />
      </div>
    </div>
  </Router>
)

const NavBar = () => (
  <div className="navbar-fixed">
    <nav className="white">
      <div className="nav-wrapper container">
        <Link id="logo-container" to="/" className="brand-logo left">textblog</Link>
        <ul id="nav-mobile" className="right">
          <li><Link to="/">Sign In</Link></li>
        </ul>
      </div>
    </nav>
  </div>
)

export default App