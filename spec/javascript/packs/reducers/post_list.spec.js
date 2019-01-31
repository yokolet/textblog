import reducer from 'reducers/post_list'
import * as types from 'constants/actions'

describe('post list', () => {
  const initialState = {
    posts: []
  }

  it('should return the initial state', () => {
    const action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  it('should handle GET_POST_LIST', () => {
    let action = {
      type: types.GET_POST_LIST,
      posts: [
        {
          "title": "Porro amet suscipit fugiat.",
          "content": "Dolorem blanditiis animi. Magni fugit in. Dicta vel unde.",
          "updated_at": "2019-01-30 22:12:36 UTC",
          "user": {
            "id": "1",
            "name": "Open Graph Test User"
          }
        },
        {
          "title": "Repudiandae tempora nobis qui.",
          "content": "Omnis et minima. Ratione sit ut. Est animi veniam.",
          "updated_at": "2019-01-29 22:12:36 UTC",
          "user": {
            "id": "1",
            "name": "Open Graph Test User"
          }
        }
      ]
    }

    let expectedState = {
      posts: [
        {
          "title": "Porro amet suscipit fugiat.",
          "content": "Dolorem blanditiis animi. Magni fugit in. Dicta vel unde.",
          "updated_at": "2019-01-30 22:12:36 UTC",
          "user": {
            "id": "1",
            "name": "Open Graph Test User"
          }
        },
        {
          "title": "Repudiandae tempora nobis qui.",
          "content": "Omnis et minima. Ratione sit ut. Est animi veniam.",
          "updated_at": "2019-01-29 22:12:36 UTC",
          "user": {
            "id": "1",
            "name": "Open Graph Test User"
          }
        }
      ]
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should not update state with posts: undefined', () => {
    const action = {
      type: types.GET_POST_LIST,
      posts: undefined
    }

    expect(reducer(initialState, action)).toEqual(initialState)
  })
})