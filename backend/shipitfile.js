const path = require('path')

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      branch: 'dr-shipit',
      deployTo: 'app',
      repositoryUrl: 'https://github.com/kyan/jukebox-js.git',
      ignores: ['.git', 'node_modules', 'README.md', 'shipitfile.js'],
      keepReleases: 5,
      deleteOnRollback: true,
      key: '~/.ssh/kyan-deploy',
      shallowClone: true
    },
    pi: {
      servers: 'jukebox@jukebox-api-prod'
    }
  })

  shipit.on('published', function () {
    shipit.start(['restart_daemon', 'restart_api_service'])
  })

  shipit.on('updated', function () {
   shipit.start(['yarn_install', 'yarn_build'])
  })

  shipit.blTask('yarn_install', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('yarn workspaces focus @jukebox/backend', { cwd })
  })

  shipit.blTask('yarn_build', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('yarn workspace @jukebox/backend build', { cwd })
  })

  shipit.blTask('restart_daemon', function () {
    return shipit.remote('sudo /bin/systemctl daemon-reload')
  })

  shipit.blTask('restart_api_service', function () {
    return shipit.remote('sudo /bin/systemctl restart jukebox-api.service')
  })
}
