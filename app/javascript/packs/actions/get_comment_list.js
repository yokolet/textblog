import { GET_COMMENT_LIST } from '../constants/actions'

export const getCommentList = (data) => {
  return {
    type: GET_COMMENT_LIST,
    comments: data.comments,
  }
}
