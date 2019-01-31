import { UPDATE_SOCIAL_LOGIN, } from '../constants/actions'

const initialState = {
  provider: '',
  access_token: null,
}

const socialLogin = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SOCIAL_LOGIN:
      return {
        ...state,
        provider: action.provider,
        access_token: action.access_token
      }
    default:
      return state
  }
}

export default socialLogin