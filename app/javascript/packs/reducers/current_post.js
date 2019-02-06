import { GET_POST } from '../constants/actions'

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
    default:
      return state
  }
}

export default currentPost