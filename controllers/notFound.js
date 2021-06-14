const NotFoundError = require('../errors/not-found-err');

module.exports.notFound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};
