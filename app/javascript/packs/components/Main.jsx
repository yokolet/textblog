import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import PostList from './PostList'

class Main extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/" component={PostList} />
        </Switch>
      </div>
    )
  }
}

export default Main