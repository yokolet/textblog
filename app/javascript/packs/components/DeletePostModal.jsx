import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { postsGql, deletePostGql, pagesGql } from './queries'
import PropTypes from 'prop-types'
import { deletePost } from '../actions/delete_post'

class DeletePostModal extends Component {
  constructor(props) {
    super(props)

    this.onClickDelete.bind(this)
    this.onClickCancel.bind(this)
  }

  onClickDelete = event => {
    event.preventDefault()

    const {
      mutate, provider, access_token, post, cur,
      deletePost, hideDeleteModal, completeDelete
    } = this.props
    mutate({
      variables: { provider, post_id: post.id },
      context: { headers: { authorization: `Bearer ${access_token}` } },
      refetchQueries: [
        { query: pagesGql },
        { query: postsGql, variables: { page: cur } }
      ]
    })
      .then(({ data }) => {
        deletePost(data)
        completeDelete(data)
      })
      .catch(res => {
        if (res.graphQLErrors) {
          let errors = res.graphQLErrors.map(error => error.message)
          this.setState({ errors })
          if (res.graphQLErrors.map(error => error.type).includes('OAuthError')) {
            window.localStorage.removeItem("_textblog_.socialLogin")
            window.localStorage.removeItem("_textblog_.serverLogin")
            this.props.updateFacebookLogin({})
            this.props.updateServerLogin({})
          }
          M.toast({html: errors.toString()})
        }
      })

    hideDeleteModal()
  }

  onClickCancel = event => {
    event.preventDefault()

    this.props.hideDeleteModal()
  }

  render () {
    const display = {
      display: 'block',
      zIndex: '10'
    }
    const hide = {
      display: 'none',
    }

    return (
      <div id="delete-post-model" className="modal" style={this.props.show ? display : hide}>
        <div className="modal-content">
          <h4>Delete Post</h4>
          <p>Are you sure to delete this post?</p>
        </div>
        <div className="modal-footer">
          <button className="waves-effect waves-light btn pink darken-1 left"
                  onClick={e => this.onClickDelete(e)}
          >
            <i className="material-icons right">delete</i>delete
          </button>
          <button className="waves-effect waves-light btn grey right"
                  onClick={e => this.onClickCancel(e)}
          >
            <i className="material-icons right">cancel</i>cancel
          </button>
        </div>
      </div>
    )
  }
}

const gqlWrapper = graphql(deletePostGql)

DeletePostModal.propTypes = {
  show: PropTypes.bool.isRequired,
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  user_id: PropTypes.string.isRequired,
  cur: PropTypes.number,
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      provider: PropTypes.string.isRequired,
    })
  }),
  hideDeleteModal: PropTypes.func.isRequired,
  completeDelete: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : undefined,
  cur: state.pages.cur
})

const mapDispatchToProps = dispatch => ({
  deletePost: (data) => dispatch(deletePost(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(DeletePostModal)
