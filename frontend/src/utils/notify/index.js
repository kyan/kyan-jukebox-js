import React from 'react'
import { toast } from 'react-toastify'
import { Icon } from 'semantic-ui-react'

const Msg = ({ message }) => (
  <span>
    <Icon
      inverted
      name='music'
      color='grey'
      circular
    />
    {message}
  </span>
)

const Notify = (message, options = {}) => {
  let defaults = {
    type: toast.TYPE.INFO,
    position: toast.POSITION.BOTTOM_RIGHT,
    newestOnTop: true,
    hideProgressBar: true,
    autoClose: 5000,
    closeButton: false,
    className: {
      'background-color': '#888888',
      'border-radius': '8px',
      'padding': '8px 12px',
      'font-weight': '100',
      'font-size': '12px',
      'line-height': '22px'
    }
  }

  toast(<Msg message={message} />, Object.assign(defaults, options))
}

export default Notify
