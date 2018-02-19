import { toast } from 'react-toastify'
import { shallow } from 'enzyme'
import notify from './index'
jest.mock('react-toastify')

describe('notify', () => {
  it('calls the toast interface', () => {
    notify('Added Foo by Bar')
    expect(toast.mock.calls.length).toEqual(1)
    expect(shallow(toast.mock.calls[0][0])).toMatchSnapshot()
    expect(toast.mock.calls[0][1]).toEqual({
      autoClose: 5000,
      className: {
        'background-color': '#888888',
        'border-radius': '8px',
        'font-size': '12px',
        'font-weight': '100',
        'line-height': '22px',
        'padding': '8px 12px'
      },
      closeButton: false,
      hideProgressBar: true,
      newestOnTop: true,
      position: 'bottom-right',
      type: 'info'
    })
  })
})
