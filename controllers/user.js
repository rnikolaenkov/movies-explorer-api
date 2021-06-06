const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { cryptRounds, jwtSecret } = require('../config/app');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, parseInt(cryptRounds, 10))
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => {
      res.send({ data: { _id: user._id } });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ConflictError('При регистрации указан email, который уже существует на сервере.'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }

      return next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }

      next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }

      next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserInfo,
};
