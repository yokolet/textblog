import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class DeletePostModel extends Component {
  constructor(props) {
    super(props)

    this.onClickDelete.bind(this)
    this.onClickCancel.bind(this)
  }

  onClickDelete = event => {
    event.preventDefault()

    this.props.hideDeleteModal()
    return (
      <Redirect push to="/" />
    )
  }

  onClickCancel = event => {
    event.preventDefault()
    
    this.props.hideDeleteModal()
  }

  render () {
    const display = { display: 'block' }
    const hide = { display: 'none' }

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

DeletePostModel.propTypes = {
  show: PropTypes.bool.isRequired,
  hideDeleteModal: PropTypes.func.isRequired
}

export default withRouter(DeletePostModel)
