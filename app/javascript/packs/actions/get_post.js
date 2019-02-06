import { GET_POST } from '../constants/actions'

export const getPost = (data) => {
  return {
    type: GET_POST,
    post: data.post,
  }
}
