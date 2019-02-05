import {
  SET_PER_PAGE,
  SET_LAST_PAGE,
  SET_CURRENT_PAGE
} from '../constants/actions'

const initialState = {
  per: 0,
  last: 0,
  cur: 1,
}

const pages = (state = initialState, action) => {
  switch (action.type) {
    case SET_PER_PAGE:
      return {
        ...state,
        per: action.per
      }
    case SET_LAST_PAGE:
      return {
        ...state,
        last: action.last
      }
    case SET_CURRENT_PAGE:
      return {
        ...state,
        cur: action.cur
      }
    default:
      return state
  }
}

export default pages