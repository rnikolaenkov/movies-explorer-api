const movie = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovieList, addFavoriteMovie, removeFavoriteMovie } = require('../controllers/movie');

movie.get('/', getMovieList);
movie.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
    trailer: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
    thumbnail: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addFavoriteMovie);
movie.delete('/:movieId', removeFavoriteMovie);

module.exports = movie;
