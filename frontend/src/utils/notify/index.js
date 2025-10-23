import toast from 'react-hot-toast'

const Notify = {
  info: ({ id, title, message }) => {
    const content = title ? `${title}: ${message}` : message
    return toast(content, {
      id,
      icon: 'ℹ️',
      duration: 3000,
      style: {
        background: '#3498db',
        color: '#fff'
      }
    })
  },
  success: ({ id, title, message }) => {
    const content = title ? `${title}: ${message}` : message
    return toast.success(content, {
      id,
      duration: 3000,
      style: {
        background: '#2ecc71',
        color: '#fff'
      }
    })
  },
  warning: ({ id, title, message }) => {
    const content = title ? `${title}: ${message}` : message
    return toast(content, {
      id,
      icon: '⚠️',
      duration: 5000,
      style: {
        background: '#f39c12',
        color: '#fff'
      }
    })
  }
}

export default Notify
