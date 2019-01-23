import { UPDATE_SERVER_LOGIN } from '../constants/actions'

const initialState = {
  user: null,
  isAuthenticated: false
}

const serverLogin = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SERVER_LOGIN:
      return {
        ...state,
        user: action.user,
        isAuthenticated: action.user && action.user.id ? true : false
      }
    default:
      return state
  }
}

export default serverLogin