import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { currentPostGql } from './queries'
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.loading && !this.props.data.loading) {
      if (this.props.data.error) {
        this.setState({
          ...this.state,
          error: this.props.data.error.message })
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

    if (this.props.data.loading) {
      return <div>Loading...</div>
    }

    if (this.state.error != null) {
      return <div>{this.state.error}</div>
    }

    if (!this.props.data.post) {
      return <div>Loading...</div>
    }

    const { isAuthenticated, user_id } = this.props
    const { post } = this.props.data
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
          show={this.state.showDeleteModal}
          post={post}
        />
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
  isAuthenticated: PropTypes.bool.isRequired,
  user_id: PropTypes.string
}

const mapStateToProps = state => ({
  isAuthenticated: state.serverLogin.isAuthenticated,
  user_id: state.serverLogin.user ? state.serverLogin.user.id : undefined,
})

const mapDispatchToProps = dispatch => ({
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(reduxWrapper, gqlWrapper)(Post)
