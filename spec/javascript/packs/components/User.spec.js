import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MockedProvider } from "react-apollo/test-utils";
import { createStore } from 'redux'
import { Provider } from "react-redux";
import reducer from 'reducers'
import { updateFacebookLogin } from 'actions/update_facebook_login'
import { updateServerLogin } from 'actions/update_server_login'
import User from 'components/User'
import { signInUserGql } from 'components/queries'

describe('<User />', () => {
  beforeEach(() => {
    window.localStorage.removeItem("_textblog_.socialLogin")
    window.localStorage.removeItem("_textblog_.serverLogin")
  })

  describe('without Redux store', () => {
    let wrapper = shallow(<User/>)

    it('should render a component', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('with Redux store and Apollo', () => {
    let gql_result = {
      data: {
        signInUser: {
          id: 1,
          provider: 'facebook',
          name: 'my name',
        }
      }
    }
    let mocks = [
      {
        request: {
          query: signInUserGql,
          variable: { provider: 'facebook' }
        },
        result: {
          gql_result
        }
      }
    ]
    let response = {
      accessToken: 'a1b2c3d4e5f6g7h8i9j0',
    }
    let store = createStore(reducer)

    it('should have empty li', () => {
      let wrapper = mount(
        <MockedProvider mocks={mocks} >
          <Provider store={store}>
            <User />
          </Provider>
        </MockedProvider>
      )
      expect(toJson(wrapper)).toMatchSnapshot()
      expect(wrapper.find('li').text()).toEqual('')
    })

    it('should have empty li after one dispatch', () => {
      store.dispatch(updateFacebookLogin(response))
      let wrapper = mount(
        <MockedProvider mocks={mocks} >
          <Provider store={store}>
            <User />
          </Provider>
        </MockedProvider>
      )
      expect(wrapper.find('li').text()).toEqual('')
    })

    it('should have user name in li after dispatches', () => {
      let data = {
        "signInUser": {
          "id": "1",
          "provider": "facebook",
          "name": "my name",
        }
      }
      store.dispatch(updateFacebookLogin(response))
      store.dispatch(updateServerLogin(data))
      let wrapper = mount(
        <MockedProvider mocks={mocks} >
          <Provider store={store}>
            <User />
          </Provider>
        </MockedProvider>
      )
      // material icon adds 'person'
      expect(wrapper.find('li').text()).toEqual('personmy name')
    })
  })
})