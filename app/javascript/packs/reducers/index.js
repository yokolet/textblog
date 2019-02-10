import { combineReducers } from 'redux'
import socialLogin from './social_login'
import serverLogin from './server_login'
import postList from './post_list'
import pages from './pages'

export default combineReducers({
  socialLogin,
  serverLogin,
  postList,
  pages
})