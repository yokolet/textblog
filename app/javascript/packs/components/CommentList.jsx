import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { commentsGql } from './queries'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import CommentForm from './CommentForm'

class CommentList extends Component {
  constructor(props) {
    super(props)

    this.onClickAdd = this.onClickAdd.bind(this)
    this.hideCommentForm = this.hideCommentForm.bind(this)
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

  renderComments() {
    return this.props.data.comments.map(comment => {
      return (
        <li key={comment.id} className="collection-item">
          <div className="comment-info">
            <span className="comment-info-name">{comment.user.name}</span>
            <span className="comment-info-time">@{comment.updated_at}</span>
          </div>
          <div className="comment-body"><pre>{comment.body}</pre></div>
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
        {this.state.error !== null ? (
          <div>{this.state.error}</div>
        ) : (
          <ul className="collection">
            {this.renderComments()}
          </ul>
        )}
        <CommentForm
          showForm={this.state.showForm}
          hideCommentForm={this.hideCommentForm}
          post_id={post_id}
        />
        <button
          className="waves-effect btn-floating right"
          style={add_style}
          onClick={e => this.onClickAdd(e)}
        >
          <i className="material-icons">add_comment</i>
        </button>
      </div>
    )
  }
}

const gqlWrapper = graphql(commentsGql, {
  options: (props) => {
    return  { variables: { post_id: props.post_id } }
  }
})

CommentList.propTypes = {
  post_id: PropTypes.string.isRequired,
  comments_count: PropTypes.number.isRequired,
  provider: PropTypes.string,
  access_token: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  provider: state.socialLogin.provider ? state.socialLogin.provider : null,
  access_token: state.socialLogin.access_token ? state.socialLogin.access_token : null,
  isAuthenticated: state.serverLogin.isAuthenticated,
})

const mapDispatchToProps = dispatch => ({
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(CommentList)
