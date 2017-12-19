import React, { Component } from 'react'
import { shallow } from 'enzyme'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import UrlDropArea from './index'

describe('UrlDropArea', () => {
  let wrapper
  const target = jest.fn()
  const onDrop = jest.fn()

  function wrapInTestContext(DecoratedComponent) {
    return DragDropContext(TestBackend)(
      class TestContextContainer extends Component {
        render() {
          return <DecoratedComponent {...this.props} />;
        }
      }
    );
  }

  describe('render', () => {
    const DropArea = wrapInTestContext(UrlDropArea);
    wrapper = shallow(
      <DropArea
        connectDropTarget={target}
        accepts={ ['__URL__'] }
        onDrop={onDrop}
      />
    )

    it('renders as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
