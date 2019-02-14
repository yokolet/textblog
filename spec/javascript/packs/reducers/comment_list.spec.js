import reducer from 'reducers/comment_list'
import * as types from 'constants/actions'

describe('post list', () => {
  let initialState = {
    comments: []
  }

  it('should return the initial state', () => {
    let action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  describe('with GET_COMMENT_LIST', () => {
    it('should handle action', () => {
      let action = {
        type: types.GET_COMMENT_LIST,
        comments: [
          {
            "id": "1",
            "body": "Inventore incidunt molestias recusandae.",
            "updated_at": "2019-02-13 16:42:11 UTC",
            "user": {
              "name": "someone's name"
            }
          }
        ]
      }
      let expectedState = {
        comments: [
          {
            "id": "1",
            "body": "Inventore incidunt molestias recusandae.",
            "updated_at": "2019-02-13 16:42:11 UTC",
            "user": {
              "name": "someone's name"
            }
          }
        ]
      }

      expect(reducer(initialState, action)).toEqual(expectedState)
    })

    it('should not update state with comments: undefined', () => {
      let action = {
        type: types.GET_COMMENT_LIST,
        comments: undefined
      }

      expect(reducer(initialState, action)).toEqual(initialState)
    })
  })
})