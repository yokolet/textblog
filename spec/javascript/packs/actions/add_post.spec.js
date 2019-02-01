import configureStore from 'redux-mock-store'
import * as actions from 'actions/add_post'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('addPost', () => {
  beforeEach(() => {
    store.clearActions()
  })

  let data = {
    "addPost": {
      "id": "1",
      "title": "Sed excepturi rerum voluptatem.",
      "content": "Hic molestiae omnis. Aspernatur ducimus molestiae. Aliquid adipisci est.",
      "updated_at": "2019-02-01 02:23:09 UTC",
      "user": {
        "id": "1",
        "name": "Gandalf The White"
      }
    }
  }

  let expectedAction = {
    type: types.ADD_POST,
    post: {
      id: "1",
      title: "Sed excepturi rerum voluptatem.",
      content: "Hic molestiae omnis. Aspernatur ducimus molestiae. Aliquid adipisci est.",
      updated_at: "2019-02-01 02:23:09 UTC",
      user: {
        id: "1",
        name: "Gandalf The White"
      }
    }
  }

  it('should create an action to return user info', () => {
    expect(actions.addPost(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.addPost(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})