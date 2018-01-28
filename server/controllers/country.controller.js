import Country from '../models/country.model';

/**
 * Get country list.
 * @returns {country[]}
 */
function list(req, res, next) {
  Country.list()
    .then(countries => {
      res.json({
        country: countries
      })
    })
    .catch(e => next(e));
}

/**
 * Create new country
 * @property {string} req.body.name - The name of country.
 * @property {string} req.body.dialCode - The dial code of country.
 * @property {string} req.body.code - The code of country.
 * @returns {Country}
 */
function create(req, res, next) {
  const country = new Country({
    name: req.body.name,
    dialCode: req.body.dialCode,
    code: req.body.code,
  });

  country.save()
    .then(savedCountry => res.json(savedCountry))
    .catch(e => next(e));
}

export default { list, create };
