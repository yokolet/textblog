import { UPDATE_SOCIAL_LOGIN } from '../constants/actions'

export const updateFacebookLogin = (response) => {
  let user = {
    access_token: response.accessToken,
    uid: response.userID,
    name: response.name,
    email: response.email
  }
  return {
    type: UPDATE_SOCIAL_LOGIN,
    provider: 'facebook',
    user
  }
}
