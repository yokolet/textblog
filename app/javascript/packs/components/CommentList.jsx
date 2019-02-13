import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { commentsGql } from './queries'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

class CommentList extends Component {
  constructor(props) {
    super(props)

    this.state = { errors: [] }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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

    const { comments_count } = this.props
    return (
      <div>
        <div>{comments_count} {comments_count < 2 ? 'Comment' : 'Comments'}</div>
        {this.state.errors.length !== 0 ? (
          <div>{this.state.errors.toString()}</div>
        ) : (
          <ul className="collection">
            {this.renderComments()}
          </ul>
        )}
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
  comments_count: PropTypes.number.isRequired
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(CommentList)
