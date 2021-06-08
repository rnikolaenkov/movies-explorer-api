const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovieList = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movieList) => res.send({ movieList }))
    .catch((err) => next(err));
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

      return next(err);
    });
};

const removeFavoriteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail()
    .then((movie) => {
      if (String(movie.owner) !== req.user._id) {
        return next(new ForbiddenError('Удаление не возможно. Не хватает прав'));
      }
      movie.deleteOne();
      return res.send({ movie });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Фильм не найден'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные.'));
      }

      next(err);
    });
};

module.exports = {
  getMovieList,
  addFavoriteMovie,
  removeFavoriteMovie,
};
