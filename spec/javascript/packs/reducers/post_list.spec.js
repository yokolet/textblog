import reducer from 'reducers/post_list'
import * as types from 'constants/actions'

describe('post list', () => {
  let initialState = {
    posts: []
  }

  it('should return the initial state', () => {
    let action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  describe('with GET_POST_LIST', () => {
    it('should handle action', () => {
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
      let action = {
        type: types.GET_POST_LIST,
        posts: undefined
      }

      expect(reducer(initialState, action)).toEqual(initialState)
    })
  })

  describe('with ADD_POST', () => {
    let initialState = {
      posts: [
        {
          "id": "1",
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

    it('should add a new post', () => {
      let action = {
        type: types.ADD_POST,
        post: {
          id: "2",
          title: "Sed excepturi rerum voluptatem.",
          content: "Hic molestiae omnis. Aspernatur ducimus molestiae. Aliquid adipisci est.",
          updated_at: "2019-02-01 02:23:09 UTC",
          user: {
            id: "2",
            name: "Gandalf The White"
          }
        }
      }
      let expectedState = {
        posts: [
          {
            "id": "2",
            "title": "Sed excepturi rerum voluptatem.",
            "content": "Hic molestiae omnis. Aspernatur ducimus molestiae. Aliquid adipisci est.",
            "updated_at": "2019-02-01 02:23:09 UTC",
            "user": {
              "id": "2",
              "name": "Gandalf The White"
            }
          },
          {
            "id": "1",
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

    it('should not update state with post: undefined', () => {
      let action = {
        type: types.ADD_POST,
        post: undefined
      }

      expect(reducer(initialState, action)).toEqual(initialState)
    })
  })
})