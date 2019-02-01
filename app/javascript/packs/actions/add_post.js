import { ADD_POST } from '../constants/actions'

export const addPost = (data) => {
  return {
    type: ADD_POST,
    post: data.addPost,
  }
}
