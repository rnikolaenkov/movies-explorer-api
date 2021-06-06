const { celebrate, Joi } = require('celebrate');
const route = require('express').Router();

const user = require('./user');
const movie = require('./movie');

const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/user');
const { notFound } = require('../controllers/notFound');

route.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

route.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

route.use('/users', auth, user);
route.use('/movies', auth, movie);

route.use('*', auth, notFound);

module.exports = route;
