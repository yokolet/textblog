import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PostList from './PostList'
import PostForm from './PostForm'
import SignIn from './SignIn'
import NoMatch from './NoMatch'

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={PostList} />
          <Route exact path="/posts/new" component={PostForm} />
          <Route exact path="/sign_in" component={SignIn} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}

export default Main
