import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { updateServerLogin } from '../actions/update_server_login'
import { signInUserGql } from './queries'

class User extends Component {
  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    this.state = { errors: [] }
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.handleLoad()
  }

  handleLoad() {
    const { access_token, isAuthenticated } = this.props
    if (access_token && isAuthenticated === false) {
      const { mutate, provider, updateServerLogin } = this.props
      mutate({
        variables: { provider },
        context: { headers: { authorization: `Bearer ${access_token}` } }
      })
        .then(({ data }) => {
          updateServerLogin(data)
        })
        .catch(res => {
          if (res.graphQLErrors) {
            let errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors })
          }
        })
    }
  }

  render () {
    if (this.props.isAuthenticated) {
      const { user_id, name } = this.props
      return (
        <li key={user_id} className="grey darken-1"><i className="material-icons left">person</i>{name}</li>
      )
    } else {
      return (
        <li></li>
      )
    }
  }
}

const gqlWrapper = graphql(signInUserGql)

User.propTypes = {
  isAuthenticated: PropTypes.bool,
  access_token: PropTypes.string,
  name: PropTypes.string.isRequired,
  user_id: PropTypes.string
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : '',
  name: state.serverLogin.user ? state.serverLogin.user.name : '',
  isAuthenticated: state.serverLogin.isAuthenticated
})

const mapDispatchToProps = dispatch => ({
  updateServerLogin: (user) => dispatch(updateServerLogin(user))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(User)
