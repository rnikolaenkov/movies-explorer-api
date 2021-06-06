const winston = require('winston');
const expressWinston = require('express-winston');

const now = new Date();
const month = parseInt(now.getMonth(), 10) + 1;
const filenameRequestLog = `${now.getFullYear()}_${month}_${now.getDate()}_request.log`;
const filenameErrorLog = `${now.getFullYear()}_${month}_${now.getDate()}_error.log`;

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: `logs/${filenameRequestLog}`, timestamp: true }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: `logs/${filenameErrorLog}` }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
