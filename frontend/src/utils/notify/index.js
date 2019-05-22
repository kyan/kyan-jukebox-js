import { notify } from 'react-notify-toast'

const Notify = (message) => notify.show(message, 'success', 3000, {})

export default Notify
