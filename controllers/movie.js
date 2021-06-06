const Movie = require('../models/movie');
const InternalServerError = require('../errors/internal-server-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const getMovieList = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movieList) => res.send({ movieList }))
    .catch(() => next(new InternalServerError('Ошибка на стороне сервера')));
};

const addFavoriteMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new BadRequestError('Вы уже добавили в избранное этот фильм'));
      }

      return next(new InternalServerError('Ошибка на стороне сервера.'));
    });
};

const removeFavoriteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ owner: req.user._id, movieId: req.params.movieId })
    .orFail()
    .then((movieList) => {
      res.send({ movieList });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Фильм не найден'));
        return;
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }

      next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

module.exports = {
  getMovieList,
  addFavoriteMovie,
  removeFavoriteMovie,
};
