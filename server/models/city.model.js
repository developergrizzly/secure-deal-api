import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 *  City Schema
 */
const CitySchema = new mongoose.Schema({
  name: {type: String, default: ''},
  state: {type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */


/**
 * Statics
 */
CitySchema.statics= {
  /**
   * List city in ascending order of 'name'.
   * @returns {Promise<City[]>}
   */
  list(stateId) {
    return this.find({state: stateId})
      .sort({ name: 1 })
      .exec();
  }
};

/**
 * @typedef city
 */
export default mongoose.model('City', CitySchema);
