import { GET_POST, DELETE_POST } from '../constants/actions'

const initialState = {
  post: null
}

const currentPost = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST:
      return {
        ...state,
        post: action.post ? action.post : initialState.post
      }
    case DELETE_POST:
      let post_id = action.post_id
      return {
        ...state,
        post: state.post && state.post.id === post_id ? null : state.post
      }
    default:
      return state
  }
}

export default currentPost