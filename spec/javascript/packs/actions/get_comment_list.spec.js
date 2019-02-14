import configureStore from 'redux-mock-store'
import * as actions from 'actions/get_comment_list'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('getCommentList', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "comments": [
      {
        "id": "1",
        "body": "Maiores ea assumenda aut.",
        "updated_at": "2019-02-13 01:55:02 UTC",
        "user": {
          "name": "who's name"
        }
      }
    ]
  }

  const expectedAction = {
    type: types.GET_COMMENT_LIST,
    comments: [
      {
        "id": "1",
        "body": "Maiores ea assumenda aut.",
        "updated_at": "2019-02-13 01:55:02 UTC",
        "user": {
          "name": "who's name"
        }
      }
    ]
  }

  it('should create an action to return user info', () => {
    expect(actions.getCommentList(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.getCommentList(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})