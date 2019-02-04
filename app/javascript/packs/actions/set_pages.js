import {
  SET_PER_PAGE,
  SET_LAST_PAGE,
  SET_CURRENT_PAGE
} from '../constants/actions'

export const setPerPage = (per) => {
  return {
    type: SET_PER_PAGE,
    per: per
  }
}

export const setLastPage = (last) => {
  return {
    type: SET_LAST_PAGE,
    last: last
  }
}

export const setCurrentPage = (cur) => {
  return {
    type: SET_CURRENT_PAGE,
    cur: cur
  }
}
