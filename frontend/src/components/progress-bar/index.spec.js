import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import ProgressBar from './index'

describe('ProgressBar', () => {
  const prevMock = jest.fn()
  const nextMock = jest.fn()
  const mockStore = configureMockStore()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('renders the as expected', () => {
      const store = mockStore({
        timer: { duration: 10000, position: 8000, remaining: 700 },
        track: { length: 12345 }
      })
      const wrapper = mount(
        <Provider store={store}>
          <ProgressBar onPrevious={prevMock} onNext={nextMock} />
        </Provider>
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})
