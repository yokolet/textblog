import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { commentsGql, deleteCommentGql } from './queries'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import CommentForm from './CommentForm'
import { updateFacebookLogin } from '../actions/update_facebook_login'
import { updateServerLogin } from '../actions/update_server_login'

class CommentList extends Component {
  constructor(props) {
    super(props)

    this.onClickAdd = this.onClickAdd.bind(this)
    this.hideCommentForm = this.hideCommentForm.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.state = {
      count: null,
      showForm: false,
      error: null
    }
  }

  componentDidMount() {
    const { comments_count } = this.props
    this.setState({ count: comments_count })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.loading && !this.props.data.loading) {
      this.setState( {
        ...this.state,
        count: this.props.data.comments.length
      })
    }

    // refetchQueries updates this.posts.data.comments
    if (!this.props.data.loading && this.props.data.comments &&
      (!prevProps.data.comments || (prevProps.data.comments.length != this.props.data.comments.length))) {
      this.setState( {
        ...this.state,
        count: this.props.data.comments.length
      })
    }

    if (!this.props.data.loading && this.props.data.error) {
      M.toast({html: this.props.data.error})
    }
  }

  onClickAdd = (event) => {
    const { isAuthenticated } = this.props
    if (isAuthenticated) {
      this.setState({
        ...this.state,
        showForm: true
      })
    } else {
      M.toast({html: 'Sign In to Add Comment'})
    }
  }

  hideCommentForm = () => {
    this.setState( {
      ...this.state,
      showForm: false })
  }

  onClickDelete = (commend_id) => {
    const { provider, access_token, post_id, mutate } = this.props
    mutate({
      variables: { provider, comment_id: commend_id },
      context: { headers: { authorization: `Bearer ${access_token}` } },
      refetchQueries: [
        { query: commentsGql, variables: { post_id: post_id } }
      ]
    })
      .catch(res => {
        if (res.graphQLErrors) {
          let errors = res.graphQLErrors.map(error => error.message)
          this.setState({
            ...this.state,
            error: errors.toString()
          })
          if (res.graphQLErrors.map(error => error.type).includes('OAuthError')) {
            window.localStorage.removeItem("_textblog_.socialLogin")
            window.localStorage.removeItem("_textblog_.serverLogin")
            this.props.updateFacebookLogin({})
            this.props.updateServerLogin({})
          }
          M.toast({html: errors.toString()})
        }
      })
  }

  renderComments() {
    const { user_id } = this.props

    let delete_style = {
      color: '#6a8692',
      cursor: 'pointer'
    }
    let row_style = {
      marginBottom: '0px'
    }
    return this.props.data.comments.map(comment => {
      return (
        <li key={comment.id} className="collection-item">
          <div className="row" style={row_style}>
            <div className="col s12">
              <div className="comment-info">
                <span className="comment-info-name">{comment.user.name}</span>
                <span className="comment-info-time">@{comment.updated_at}</span>
              </div>
            </div>
          </div>
          <div className="row" style={row_style}>
            <div className="col s11">
              <div className="comment-body"><pre>{comment.body}</pre></div>
            </div>
            <div className="col s1">
              { user_id === comment.user.id &&
                <i
                  className="material-icons"
                  style={delete_style}
                  onClick = {() => this.onClickDelete(comment.id)}
                >
                  delete
                </i>
              }
            </div>
          </div>
        </li>
      )
    })
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>
    }

    const { post_id } = this.props
    const { count } = this.state

    let add_style = {
      backgroundColor: '#f3ae93'
    }
    return (
      <div>
        <div>{count} {count < 2 ? 'Comment' : 'Comments'}</div>
        <ul className="collection">
          {this.renderComments()}
        </ul>
        <CommentForm
          showForm={this.state.showForm}
          hideCommentForm={this.hideCommentForm}
          post_id={post_id}
        />
        {!this.state.showForm &&
          <button
            className="waves-effect btn-floating right"
            style={add_style}
            onClick={e => this.onClickAdd(e)}
          >
            <i className="material-icons">add_comment</i>
          </button>
        }
      </div>
    )
  }
}

const gqlWrapper = graphql(commentsGql, {
  options: (props) => {
    return  { variables: { post_id: props.post_id } }
  }
})

const deleteCommentGqlWrapper = graphql(deleteCommentGql)

CommentList.propTypes = {
  post_id: PropTypes.string.isRequired,
  comments_count: PropTypes.number.isRequired,
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  updateFacebookLogin: PropTypes.func.isRequired,
  updateServerLogin: PropTypes.func.isRequired,
  user_id: PropTypes.string
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated,
  user_id: state.serverLogin.user !== null ? state.serverLogin.user.id : null
})

const mapDispatchToProps = dispatch => ({
  updateFacebookLogin: (response) => dispatch(updateFacebookLogin(response)),
  updateServerLogin: (data) => dispatch(updateServerLogin(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(deleteCommentGqlWrapper, gqlWrapper, reduxWrapper)(CommentList)
