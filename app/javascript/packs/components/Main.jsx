import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PostList from './PostList'
import AddPostForm from './AddPostForm'
import EditPostForm from './EditPostForm'
import Post from './Post'
import SignIn from './SignIn'
import NoMatch from './NoMatch'

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={PostList} />
          <Route exact path="/posts/new" component={AddPostForm} />
          <Route exact path="/posts/:id" component={Post} />
          <Route exact path="/posts/:id/edit" component={EditPostForm} />
          <Route exact path="/sign_in" component={SignIn} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}

export default Main
