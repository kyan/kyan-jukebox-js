import { store } from 'react-notifications-component'

const Notify = {
  info: ({ id, title, message }) => {
    return store.addNotification({
      id,
      title,
      message,
      type: 'info',
      insert: 'top',
      container: 'bottom-left',
      dismiss: {
        duration: 3000
      }
    })
  },
  success: ({ id, title, message }) => {
    return store.addNotification({
      id,
      title,
      message,
      type: 'success',
      insert: 'top',
      container: 'bottom-left',
      dismiss: {
        duration: 3000
      }
    })
  },
  warning: ({ id, title, message }) => {
    return store.addNotification({
      id,
      title,
      message,
      type: 'warning',
      insert: 'top',
      container: 'bottom-left',
      dismiss: {
        duration: 5000
      }
    })
  }
}

export default Notify
