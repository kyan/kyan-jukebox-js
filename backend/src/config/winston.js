const winston = require('winston')

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    format: winston.format.simple(),
    colorize: true
  }
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  }
}

export default logger
