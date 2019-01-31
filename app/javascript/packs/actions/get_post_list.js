import { GET_POST_LIST } from '../constants/actions'

export const getPostList = (data) => {
  return {
    type: GET_POST_LIST,
    posts: data.allPosts,
  }
}
