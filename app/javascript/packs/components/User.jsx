import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { updateServerLogin } from "../actions";

class User extends Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.handleLoad()
  }

  handleLoad() {
    if (this.props.access_token) {
      this.props.mutate({
        variables: { provider: this.props.provider },
        context: { headers: { authorization: `Bearer ${this.props.access_token}` } }
      })
        .then(({ data }) => {
          this.props.updateServerLogin(data)
        })
    }
  }

  render () {
    if (this.props.name) {
      const { user_id, name } = this.props
      return (
        <li key={user_id} className="grey darken-1">{name}</li>
      )
    } else {
      return (
        <li></li>
      )
    }
  }
}

const signInUser = gql`
  mutation SignInUser($provider: String!) {
    signInUser(provider: $provider) {
      id
      provider
      uid
      name
      email
    }
  }
`

const gqlWrapper = graphql(signInUser)

User.propTypes = {
  isAuthenticated: PropTypes.bool,
  access_token: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  user_id: PropTypes.string
}

const mapStateToProps = state => ({
  provider: state.provider,
  access_token: state.user ? state.user.access_token : '',
  user_id: state.user ? state.user.id : '',
  name: state.user ? state.user.name : '',
  isAuthenticcated: state.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  updateServerLogin: (user) => dispatch(updateServerLogin(user))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(User)
