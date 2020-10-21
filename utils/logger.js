const { format, transports, createLogger } = require('winston');

// Winston logger
const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}::${message}`)
      ),
    }),
  ],
});

module.exports = logger;
