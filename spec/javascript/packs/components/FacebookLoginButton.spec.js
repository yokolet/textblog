import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import { createStore } from 'redux'
import reducer from 'reducers'
import * as actions from 'actions/update_facebook_login'
import FacebookLoginButton from 'components/FacebookLoginButton'

describe('<FacebookLoginButton />', () => {
  describe('render()', () => {
    let wrapper = shallow(<FacebookLoginButton/>)

    it('renders a component', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('with Redux store', () => {
    const store = createStore(reducer)
    let response = {
      accessToken: 'a1b2c3d4e5f6g7h8i9j0',
      userID: 1234567890,
      name: 'my name',
      email: 'myemail@example.com'
    }

    it('sees store', () => {
      store.dispatch(actions.updateFacebookLogin(response))
      let wrapper = mount(
        <Provider store={store}>
          <Router>
            <FacebookLoginButton/>
          </Router>
        </Provider>)
      expect(wrapper.find(Redirect)).toHaveLength(1)
    })
  })
})
