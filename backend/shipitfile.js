module.exports = function (shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-yarn')(shipit)

  shipit.on('yarn:installed', function () {
    shipit.start('yarn:cmd')
  })

  shipit.initConfig({
    default: {
      yarn: {
        remote: true,
        cmd: 'build',
        installFlags: ['--production']
      },
      branch: 'master',
      workspace: '/tmp/kyan-jukebox-backend',
      dirToCopy: 'backend',
      deployTo: 'jukebox',
      repositoryUrl: 'https://github.com/kyan/jukebox-js.git',
      ignores: ['.git', 'node_modules', 'README.md'],
      keepReleases: 5,
      deleteOnRollback: true,
      key: '~/.ssh/kyan-deploy',
      shallowClone: true
    },
    pi: {
      servers: 'pi@jb-pi'
    }
  })
}
