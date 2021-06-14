const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');

const route = require('./routes/route');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const { serverPort, db, RATE_LIMIT } = require('./config/app');

const corsOptions = {
  origin: 'https://rnikolaenkov.nomoredomains.icu',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTION',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

const limiter = rateLimit(RATE_LIMIT);

const app = express();
app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/', route);

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(serverPort, () => {
  // eslint-disable-next-line no-console
  console.info(`Server started on server port ${serverPort}`);
});
