import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { updateServerLogin } from '../actions/update_server_login'
import { signInUserGql } from './queries'

class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = { cur: 1, start: 1, size: 9}
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  renderLinks() {
    let { start, size} = this.state
    let pages = Array.from(Array(size), (x, i) => i + start)
    return pages.map(page => {
      return (
        <li className={page === this.state.cur ? "active" : "waves-effect"}
            key={page}
            onClick={e => this.setState({cur: page})}
        >
          <a>{page}</a>
        </li>
      )
    })
  }

  dec(event) {
    event.preventDefault()

    const { cur, start } = this.state
    if (cur > start) {
      this.setState({ cur: cur - 1 })
    }
  }

  inc(event) {
    event.preventDefault()

    const { cur, start, size } = this.state
    if (cur < (start + size - 1)) {
      this.setState({ cur: cur + 1 })
    }
  }

  render () {
    const { cur, start, size } = this.state
    return (
      <div className="center">
        <ul className="pagination">
          <li className={cur === 1 ? "disabled" : "waves-effect"}
              onClick={this.dec.bind(this)}
          >
            <a><i className="material-icons">chevron_left</i></a>
          </li>
          {this.renderLinks()}
          <li className={cur === (start + size - 1) ? "disabled" : "waves-effect"}
              onClick={this.inc.bind(this)}
          >
            <a><i className="material-icons">chevron_right</i></a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Pagination