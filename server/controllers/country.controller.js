import User from '../models/country.model';

/**
 * Get country list.
 * @returns {country[]}
 */
function list(req, res, next) {
  User.list()
    .then(countries => res.json(countries))
    .catch(e => next(e));
}

export default { list };
