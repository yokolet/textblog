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
      // post list will be refetched. no need to do something
      return {
        ...state,
        posts: action.post ? [action.post, ...state.posts] : state.posts
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