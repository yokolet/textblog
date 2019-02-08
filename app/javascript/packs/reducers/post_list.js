import {
  GET_POST_LIST,
  ADD_POST,
  DELETE_POST
} from '../constants/actions'

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
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.post_id)
      }

    default:
      return state
  }
}

export default postList