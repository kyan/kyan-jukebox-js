const path = require('path')

module.exports = function (shipit) {
  require('shipit-deploy')(shipit)

  const config = {
    default: {
      branch: 'master',
      workspace: '/tmp/kyan-jukebox-backend',
      dirToCopy: 'backend',
      deployTo: 'app',
      repositoryUrl: 'https://github.com/kyan/jukebox-js.git',
      ignores: ['.git', 'node_modules', 'README.md', 'shipitfile.js'],
      keepReleases: 5,
      deleteOnRollback: true,
      key: '~/.ssh/kyan-deploy',
      shallowClone: true
    },
    pi: {
      servers: 'jukebox@jb-pi'
    }
  }
  shipit.initConfig(config)

  shipit.on('updated', function () {
    shipit.start(['yarn_install', 'yarn_build'])
  })

  shipit.blTask('yarn_install', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('yarn install --production', { cwd })
  })

  shipit.blTask('yarn_build', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('yarn build', { cwd })
  })
}
