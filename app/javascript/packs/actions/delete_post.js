import { DELETE_POST } from '../constants/actions'

export const deletePost = (data) => {
  return {
    type: DELETE_POST,
    post_id: data.deletePost,
  }
}
