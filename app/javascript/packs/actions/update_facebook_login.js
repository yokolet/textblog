import { UPDATE_SOCIAL_LOGIN } from '../constants/actions'

export const updateFacebookLogin = (response) => {
  return {
    type: UPDATE_SOCIAL_LOGIN,
    provider: 'facebook',
    access_token: response.accessToken ? response.accessToken : null
  }
}
