import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MockedProvider } from "react-apollo/test-utils";
import { createStore } from 'redux'
import { Provider } from "react-redux";
import reducer from 'reducers'
import { getPostList } from 'actions/get_post_list'
import PostList from 'components/PostList'
import { allPostsGql } from 'components/queries'

describe('<PostList />', () => {
  describe('without Redux store', () => {
    let wrapper = shallow(<PostList/>)

    it('should render a component', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('with Redux store and Apollo', () => {
    let gql_result = {
      data: {
        allPosts: [
          {
            title: "Porro amet suscipit fugiat.",
            content: "Dolorem blanditiis animi. Magni fugit in. Dicta vel unde.",
            update_at: "2019-01-30 22:12:36 UTC",
            user: {
              id: "1",
              name: "Open Graph Test User"
            }
          },
          {
            title: "Repudiandae tempora nobis qui.",
            content: "Omnis et minima. Ratione sit ut. Est animi veniam.",
            updated_at: "2019-01-29 22:12:36 UTC",
            user: {
              id: "1",
              name: "Open Graph Test User"
            }
          }
        ]
      }
    }
    let mocks = [
      {
        request: {
          query: allPostsGql
        },
        result: {
          gql_result
        }
      }
    ]
    let store = createStore(reducer)

    xit('should have empty ul', () => {
      let wrapper = mount(
        <MockedProvider mocks={mocks} >
          <Provider store={store}>
            <PostList />
          </Provider>
        </MockedProvider>
      )
      expect(toJson(wrapper)).toMatchSnapshot()
      // children() returns undefined, needs to figure out
      expect(wrapper.find('ul').children()).to.have.lengthOf(0)
    })

    xit('should have children of ul after dispatch', () => {
      store.dispatch(getPostList(gql_result))
      let wrapper = mount(
        <MockedProvider mocks={mocks} >
          <Provider store={store}>
            <PostList />
          </Provider>
        </MockedProvider>
      )
      // children() returns undefined, needs to figure out
      expect(wrapper.find('ul').children()).to.have.lengthOf(2)
    })
  })
})