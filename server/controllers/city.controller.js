import City from '../models/city.model';

/**
 * Get city list.
 * @returns {City[]}
 */
function list(req, res, next) {
  let stateId= req.params.stateId;
  City.list(stateId)
    .then(cities => {
      res.json({
        cities
      })
    })
    .catch(e => next(e));
}

/**
 * States new city
 * @property {string} req.body.name - The name of state.
 * @property {ObjectId} req.body.state - The ObjectId of state.
 * @returns {City}
 */
function create(req, res, next) {
  const city = new City({
    name: req.body.name,
    state: req.body.state,
  });

  city.save()
    .then(savedCity => res.json(savedCity))
    .catch(e => next(e));
}

export default { list, create };
