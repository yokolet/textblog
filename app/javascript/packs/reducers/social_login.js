import { UPDATE_SOCIAL_LOGIN, } from '../constants/actions'

const initialState = {
  provider: '',
  user: null,
}

const socialLogin = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SOCIAL_LOGIN:
      return {
        ...state,
        provider: action.provider,
        user: action.user
      }
    default:
      return state
  }
}

export default socialLogin