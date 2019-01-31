import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import { createStore } from 'redux'
import reducer from 'reducers'
import { updateFacebookLogin } from 'actions/update_facebook_login'
import FacebookLoginButton from 'components/FacebookLoginButton'

describe('<FacebookLoginButton />', () => {
  describe('without Redux store', () => {
    let wrapper = shallow(<FacebookLoginButton/>)

    it('should render a component', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('with Redux store', () => {
    let store = createStore(reducer)
    let response = {
      accessToken: 'a1b2c3d4e5f6g7h8i9j0',
    }

    it('should have Redirect link after dispatch', () => {
      store.dispatch(updateFacebookLogin(response))
      let wrapper = mount(
        <Provider store={store}>
          <Router>
            <FacebookLoginButton/>
          </Router>
        </Provider>)
      expect(wrapper.find(Redirect)).toHaveLength(1)
      wrapper.unmount()
    })
  })
})
