import { combineReducers } from 'redux'
import socialLogin from './social_login'
import serverLogin from './server_login'

export default combineReducers({
  socialLogin,
  serverLogin
})