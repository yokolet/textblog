import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { getPostList } from '../actions/get_post_list'
import { setPerPage, setLastPage, setCurrentPage } from '../actions/set_pages'
import { pagesGql } from './queries'

class Pagination extends Component {
  constructor(props) {
    super(props)

    this.onClickNumber = this.onClickNumber.bind(this)
    this.dec = this.dec.bind(this)
    this.inc = this.inc.bind(this)
    this.state = { first: 1 }
  }

  componentWillUpdate(nextProps) {
    const { per, last, cur, setPerPage, setLastPage, setCurrentPage } = this.props
    if (this.props.data.loading && !nextProps.data.loading) {
      if (per !== nextProps.data.pages.per) {
        setPerPage(nextProps.data.pages.per)
      }
      if (last !== nextProps.data.pages.last) {
        setLastPage(nextProps.data.pages.last)
      }
      if (cur === 0) {
        setCurrentPage(this.state.first)
      }
    }
    // refetchQueries pull out updated data which are in nextProps
    if (!this.props.data.loading && (last !== nextProps.data.pages.last)) {
      setLastPage(nextProps.data.pages.last)
    }
  }

  updatePosts = number => {
    const { setCurrentPage, getPostList, fetchMore } = this.props
    setCurrentPage(number)
    fetchMore({
      variables: {
        page: number
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          getPostList(fetchMoreResult)
        }
      }
    })
  }

  onClickNumber = (event, number) => {
    event.preventDefault()

    this.updatePosts(number)
  }

  renderLinks() {
    const { first } = this.state
    const { cur, last } = this.props
    let numbers = Array.from(Array(last - first + 1), (x, i) => i + first)
    return numbers.map(number => {
      return (
        <li className={number === cur ? "active" : "waves-effect"}
            key={number}
            onClick={e => this.onClickNumber(e, number)}
        >
          <a>{number}</a>
        </li>
      )
    })
  }

  dec = event => {
    event.preventDefault()

    const { first } = this.state
    const { cur } = this.props
    if (cur > first) {
      this.updatePosts(cur - 1)
    }
  }

  inc = event => {
    event.preventDefault()

    const { cur, last } = this.props
    if (cur < last) {
      this.updatePosts(cur + 1)
    }
  }

  render () {
    const { first } = this.state
    const { cur, last } = this.props
    return (
      <div className="center">
        <ul className="pagination">
          <li className={cur === first ? "disabled" : "waves-effect"}
              onClick={this.dec.bind(this)}
          >
            <a><i className="material-icons">chevron_left</i></a>
          </li>
          {this.renderLinks()}
          <li className={cur === last ? "disabled" : "waves-effect"}
              onClick={this.inc.bind(this)}
          >
            <a><i className="material-icons">chevron_right</i></a>
          </li>
        </ul>
      </div>
    )
  }
}

const gqlWrapper = graphql(pagesGql)

Pagination.propTypes = {
  per: PropTypes.number,
  last: PropTypes.number,
  cur: PropTypes.number,
  setPerPage: PropTypes.func.isRequired,
  setLastPage: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  getPostList: PropTypes.func.isRequired,
  fetchMore: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  per: state.pages.per,
  last: state.pages.last,
  cur: state.pages.cur
})

const mapDispatchToProps = dispatch => ({
  setPerPage: (per) => dispatch(setPerPage(per)),
  setLastPage: (last) => dispatch(setLastPage(last)),
  setCurrentPage: (cur) => dispatch(setCurrentPage(cur)),
  getPostList: (data) => dispatch(getPostList(data)),
})

const reduxWrapper = connect(mapStateToProps, mapDispatchToProps)
export default compose(gqlWrapper, reduxWrapper)(Pagination)
