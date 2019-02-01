import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql } from "react-apollo";
import { addPost } from '../actions/add_post'
import { addPostGql } from './queries'

class PostForm extends Component {
  constructor(props) {
    super(props)

    this.state = { title: '', content: ''}
  }

  onSubmit(event) {
    event.preventDefault()
  }

  render() {
    const { isAuthenticated } = this.props
    if (isAuthenticated) {
      return (
        <div>
          Form
        </div>
      )
    } else {
      return (
        <div>
          Please Sign In
        </div>
      )
    }
  }
}

const gqlWrapper = graphql(addPostGql)

PostForm.propTypes = {
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  addPost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  addPost: (data) => dispatch(addPost(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)

export default compose(reduxWrapper, gqlWrapper)(PostForm)
