import { GET_COMMENT_LIST } from '../constants/actions'

const initialState = {
  comments: []
}

const commentList = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENT_LIST:
      return {
        ...state,
        comments: action.comments ? action.comments : []
      }
    default:
      return state
  }
}

export default commentList