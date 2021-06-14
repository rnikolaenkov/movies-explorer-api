require('dotenv').config();

const {
  NODE_ENV = 'dev',
  JWT_SECRET = 'secret',
  CRYPT_ROUNDS = 10,
  SERVER_PORT = 3000,
  DB_URL = 'mongodb://localhost:27017/moviedb',
} = process.env;

const jwtSecret = (NODE_ENV === 'dev') ? 'secret' : JWT_SECRET;
const cryptRounds = (NODE_ENV === 'dev') ? 10 : CRYPT_ROUNDS;
const serverPort = (NODE_ENV === 'dev') ? 3001 : SERVER_PORT;
const db = (NODE_ENV === 'dev') ? 'mongodb://localhost:27017/mestodb' : DB_URL;

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

module.exports = {
  jwtSecret,
  cryptRounds,
  serverPort,
  db,
  RATE_LIMIT,
};
