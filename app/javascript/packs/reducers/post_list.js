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
      let prevPosts = state.posts.length < 5
          ? state.posts
          : state.posts.slice(0, state.posts.length - 1)
      return {
        ...state,
        posts: action.post
          ? [action.post, ...prevPosts]
          : state.posts
      }
    default:
      return state
  }
}

export default postList