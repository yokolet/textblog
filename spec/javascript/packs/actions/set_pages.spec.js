import configureStore from 'redux-mock-store'
import * as actions from 'actions/set_pages'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('set_pages', () => {
  beforeEach(() => {
    store.clearActions()
  })

  describe('setPerPage', () => {
    let expectedAction = {
      type: types.SET_PER_PAGE,
      per: 8
    }

    it('should create an action to return per page', () => {
      expect(actions.setPerPage(8)).toEqual(expectedAction)
    })

    it('should dispatch action and return expected result', () => {
      store.dispatch(actions.setPerPage(8))
      expect(store.getActions()).toEqual([expectedAction])
    })
  })

  describe('setLastPage', () => {
    let expectedAction = {
      type: types.SET_LAST_PAGE,
      last: 2
    }

    it('should create an action to return last page', () => {
      expect(actions.setLastPage(2)).toEqual(expectedAction)
    })

    it('should dispatch action and return expected result', () => {
      store.dispatch(actions.setLastPage(2))
      expect(store.getActions()).toEqual([expectedAction])
    })
  })

  describe('setCurPage', () => {
    let expectedAction = {
      type: types.SET_CURRENT_PAGE,
      cur: 2
    }

    it('should create an action to return per page', () => {
      expect(actions.setCurrentPage(2)).toEqual(expectedAction)
    })

    it('should dispatch action and return expected result', () => {
      store.dispatch(actions.setCurrentPage(2))
      expect(store.getActions()).toEqual([expectedAction])
    })
  })
})