const path = require('path')

module.exports = shipit => {
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
      servers: 'jukebox@jukebox-prod'
    }
  }
  shipit.initConfig(config)

  shipit.on('published', function () {
    shipit.start(['restart_daemon', 'restart_api_service'])
  })

  shipit.on('updated', function () {
    shipit.start(['npm_install', 'npm_build'])
  })

  shipit.blTask('npm_install', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('npm install', { cwd })
  })

  shipit.blTask('npm_build', function () {
    const cwd = path.join(shipit.releasesPath, shipit.releaseDirname)
    return shipit.remote('npm run build', { cwd })
  })

  shipit.blTask('restart_daemon', function () {
    return shipit.remote('sudo /bin/systemctl daemon-reload')
  })

  shipit.blTask('restart_api_service', function () {
    return shipit.remote('sudo /bin/systemctl restart jukebox-api.service')
  })
}
