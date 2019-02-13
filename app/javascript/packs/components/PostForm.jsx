import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PostForm extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = { title: '', content: '' }
  }

  componentDidMount() {
    const { title, content } = this.props
    this.setState({ title, content })
  }

  onSubmit = (event) => {
    event.preventDefault()

    let goodTitle = false
    let goodContent = false
    if (this.state.title.length < 1) {
      M.toast({html: 'Title should not be empty '})
    } else if (this.state.title.length > 50) {
      M.toast({html: 'Title length should be <= 50'})
    } else {
      goodTitle = true
    }
    if (this.state.content < 1) {
      M.toast({html: 'Content should not be empty '})
    } else if (this.state.content.length > 5000) {
      M.toast({html: 'Content length should be <= 5000'})
    } else {
      goodContent = true
    }

    if (goodTitle && goodContent) {
      this.props.onSubmit(this.state)
    }
  }

  render() {
    const { isAuthenticated, type } = this.props

    let styles = {
      marginTop: '20px'
    }

    return (
      <div className="row" style={styles}>
        <div className="col s12 m12">
            {isAuthenticated ? (
              <form onSubmit={this.onSubmit}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="title"
                      type="text"
                      className="validate"
                      value={this.state.title}
                      onChange={e => this.setState({ title: e.target.value })}
                    />
                    <label className="active" htmlFor="title">Title</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <textarea
                      id="content"
                      className="materialize-textarea"
                      value={this.state.content}
                      onChange={e => this.setState({ content: e.target.value })}
                    ></textarea>
                    <label className="active" htmlFor="content">Content</label>
                  </div>
                </div>
                <div className="row">
                  <button className="btn waves-effect waves-light right" type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flow-text center">{`Please Sign In to ${type} Post`}</div>
            )}
        </div>
      </div>
    )
  }
}

PostForm.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}

export default PostForm
