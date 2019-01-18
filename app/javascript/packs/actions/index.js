import {
  UPDATE_SOCIAL_LOGIN,
  UPDATE_SERVER_LOGIN
} from '../constants/actions'

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

export const updateServerLogin = (data) => {
  return {
    type: UPDATE_SERVER_LOGIN,
    user: data.signInUser
  }
}
