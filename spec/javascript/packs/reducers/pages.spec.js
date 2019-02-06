import reducer from 'reducers/pages'
import * as types from 'constants/actions'

describe('pages', () => {
  const initialState = {
    per: 0,
    last: 0,
    cur: 1
  }

  it('should return the initial state', () => {
    let action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  it('should handle SET_PER_PAGE', () => {
    let action = {
      type: types.SET_PER_PAGE,
      per: 8
    }

    let expectedState = {
      per: 8,
      last: 0,
      cur: 1
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SET_LAST_PAGE', () => {
    let action = {
      type: types.SET_LAST_PAGE,
      last: 2
    }

    let expectedState = {
      per: 0,
      last: 2,
      cur: 1
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SET_CURRENT_PAGE', () => {
    let action = {
      type: types.SET_CURRENT_PAGE,
      cur: 2
    }

    let expectedState = {
      per: 0,
      last: 0,
      cur: 2
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})