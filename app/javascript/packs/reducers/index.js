import {
  UPDATE_SOCIAL_LOGIN,
  UPDATE_SERVER_LOGIN,
} from '../constants/actions'

const initialState = {
  provider: '',
  user: null,
  isAuthenticated: false
}

const updateUser = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SOCIAL_LOGIN:
      return {
        ...state,
        provider: action.provider,
        user: action.user
      }
    case UPDATE_SERVER_LOGIN:
      return {
        ...state,
        user: {
          ...state.user,
          id: action.user.id,
        },
        isAuthenticated: action.user && action.user.id ? true : false
      }
    default:
      return state
  }
}

export default updateUser