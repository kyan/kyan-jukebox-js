const cron = require('node-cron');

const Scheduler = {
  scheduleAutoPlayback: ({ play, pause }) => {
    // var pauseJukebox = cron.schedule('0 19 * * *', () =>  {
    var pauseJukebox = cron.schedule('* * * * *', () =>  {
      pause();
      console.log('##################')
      console.log('Pause')
      console.log('##################')
    });
    // var playJukebox = cron.schedule('0 8 * * *', () =>  {
    var playJukebox = cron.schedule('* * * * *', () =>  {
      play();
      console.log('##################')
      console.log('Play')
      console.log('##################')
    });

    playJukebox.start();
    pauseJukebox.start();
  }
}

export default Scheduler
