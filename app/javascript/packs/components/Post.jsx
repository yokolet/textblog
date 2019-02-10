import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { currentPostGql } from './queries'
import { getPost } from '../actions/get_post'
import DeletePostModal from './DeletePostModal'

class Post extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteModal: false,
      postDeleted: null,
      error: null
    }

    this.onClickDelete.bind(this)
    this.hideDeleteModal.bind(this)
    this.completeDelete.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.data.loading && !nextProps.data.loading) {
      if (nextProps.data.error) {
        this.setState({ error: nextProps.data.error.message })
      } else {
        this.props.getPost(nextProps.data)
      }
    }
  }

  onClickDelete = event => {
    event.preventDefault()
    this.setState({ showDeleteModal: true })
  }

  hideDeleteModal = () => {
    this.setState( { showDeleteModal: false })
  }

  completeDelete = (data) => {
    this.setState( { postDeleted: data.deletePost })
  }

  render() {
    let row_styles = {
      marginTop: '20px'
    }

    let card_panel_styles = {
      paddingBottom: '64px'
    }

    if (this.state.postDeleted !== null) {
      return (
        <Redirect push to="/" />
      )
    }
    if (this.state.error != null) {
      return <div>{this.state.error}</div>
    }
    if (this.props.data.loading || this.props.post === null) {
      return <div>Loading...</div>
    }

    const { post, isAuthenticated, user_id } = this.props
    return (
      <div className="row" style={row_styles}>
        <div className="col s12 m12">
          <div className="card-panel white" style={card_panel_styles}>
            <div className="post-info">
              <span className="post-info-name">{post.user.name}</span>
              <span className="post-info-time">@{post.updated_at}</span>
            </div>
            <div className="card">
              <div className="card-content">
                <span className="card-title">{post.title}</span>
                <div className="post-content"><pre>{post.content}</pre></div>
              </div>
            </div>
            { (isAuthenticated && user_id === post.user.id) &&
            <div className="card-action">
              <button className="waves-effect waves-light btn pink darken-1 left"
                      onClick={e => this.onClickDelete(e)}
              >
                <i className="material-icons right">delete</i>delete
              </button>
              <Link to={`/posts/${post.id}/edit`}>
                <button className="waves-effect waves-light btn right"
                >
                  <i className="material-icons right">create</i>edit
                </button>
              </Link>
            </div>
            }
          </div>
        </div>
        { (isAuthenticated && user_id === post.user.id) &&
        <DeletePostModal
          hideDeleteModal={this.hideDeleteModal}
          completeDelete={this.completeDelete}
          show={this.state.showDeleteModal}/>
        }
      </div>
    )
  }
}

const gqlWrapper = graphql(currentPostGql, {
    options: (props) => {
      return { variables: { id: props.match.params.id } }
  }
})

Post.propTypes = {
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
  isAuthenticated: PropTypes.bool,
  getPost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.serverLogin.isAuthenticated,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : undefined,
  post: state.currentPost.post
})

const mapDispatchToProps = dispatch => ({
  getPost: (data) => dispatch(getPost(data))
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(Post)
