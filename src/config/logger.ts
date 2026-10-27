import winston from 'winston';
const { combine, timestamp, json, colorize } = winston.format;

// https://github.com/winstonjs/winston#readme
const Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  transports: [new winston.transports.Console()],
});

export default Logger;
