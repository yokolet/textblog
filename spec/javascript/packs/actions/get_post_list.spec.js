import configureStore from 'redux-mock-store'
import * as actions from 'actions/get_post_list'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('getPostList', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "allPosts": [
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

  const expectedAction = {
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

  it('should create an action to return user info', () => {
    expect(actions.getPostList(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.getPostList(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})