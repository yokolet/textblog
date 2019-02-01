import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PostList from './PostList'
import PostForm from './PostForm'
import SignIn from './SignIn'

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={PostList} />
          <Route path="/posts/new" component={PostForm} />
          <Route path="/sign_in" component={SignIn} />
        </Switch>
      </div>
    )
  }
}

export default Main
