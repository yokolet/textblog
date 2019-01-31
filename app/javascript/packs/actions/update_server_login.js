import { UPDATE_SERVER_LOGIN } from '../constants/actions'

export const updateServerLogin = (data) => {
  return {
    type: UPDATE_SERVER_LOGIN,
    user: data.signInUser ? data.signInUser : null
  }
}
