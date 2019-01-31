import { GET_POST_LIST } from '../constants/actions'

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
    default:
      return state
  }
}

export default postList