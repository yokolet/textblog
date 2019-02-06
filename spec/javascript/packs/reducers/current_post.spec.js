import reducer from 'reducers/current_post'
import * as types from 'constants/actions'

describe('current post', () => {
  let initialState = {
    post: null
  }

  it('should return the initial state', () => {
    let action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  describe('with GET_POST', () => {
    it('should handle action', () => {
      let action = {
        type: types.GET_POST,
        post: {
          id: "1",
          title: "this title",
          content: "this content",
          updated_at: "2019-01-13 22:12:36 UTC",
          user: {
            id: "1",
            name: "my name",
            provider: "facebook"
          }
        }
      }
      let expectedState = {
        post: {
          id: "1",
          title: "this title",
          content: "this content",
          updated_at: "2019-01-13 22:12:36 UTC",
          user: {
            id: "1",
            name: "my name",
            provider: "facebook"
          }
        }
      }

      expect(reducer(initialState, action)).toEqual(expectedState)
    })

    it('should not update state with post: undefined', () => {
      let action = {
        type: types.GET_POST,
        post: undefined
      }

      expect(reducer(initialState, action)).toEqual(initialState)
    })
  })
})