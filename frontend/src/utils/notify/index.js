import Push from 'push.js'

const Notify = (title, options = {}) => {
  let defaults = {
    silent: true,
    icon: '/jukebox.png'
  }

  Push.create(title, Object.assign(defaults, options))
}

export default Notify
