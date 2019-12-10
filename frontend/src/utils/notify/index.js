import { notify } from 'react-notify-toast'

const Notify = {
  success: (message) => notify.show(message, 'success', 3000, {}),
  warning: (message) => notify.show(message, 'warning', 3000, {})
}

export default Notify
