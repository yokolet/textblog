import { UPDATE_POST } from '../constants/actions'

export const updatePost = (data) => {
  return {
    type: UPDATE_POST,
    post_id: data.updatePost,
  }
}
