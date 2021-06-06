const user = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCurrentUser, updateUserInfo } = require('../controllers/user');

user.get('/me', getCurrentUser);

user.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), updateUserInfo);

module.exports = user;
