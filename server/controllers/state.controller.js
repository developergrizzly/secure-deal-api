import State from '../models/state.model';

/**
 * Get state list.
 * @returns {State[]}
 */
function list(req, res, next) {
  let countryId= req.params.countryId;
  State.list(countryId)
    .then(states => {
      res.json({
        states
      })
    })
    .catch(e => next(e));
}

/**
 * States new country
 * @property {string} req.body.name - The name of state.
 * @property {ObjectId} req.body.country - The dial code of country.
 * @returns {State}
 */
function create(req, res, next) {
  const state = new State({
    name: req.body.name,
    country: req.body.country,
  });

  state.save()
    .then(savedState => res.json(savedState))
    .catch(e => next(e));
}

export default { list, create };
