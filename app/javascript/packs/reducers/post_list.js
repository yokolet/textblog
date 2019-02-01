import { GET_POST_LIST, ADD_POST } from '../constants/actions'

const initialState = {
  posts: []
}

const postList = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST_LIST:
      return {
        ...state,
        posts: action.posts ? action.posts : []
      }
    case ADD_POST:
      return {
        ...state,
        posts: action.post ? [...state.posts, action.post] : state.posts
      }
    default:
      return state
  }
}

export default postList