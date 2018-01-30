import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 *  State Schema
 */
const StateSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  country: {type: mongoose.Schema.Types.ObjectId, ref: 'Country', default: null}
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
StateSchema.statics= {
  /**
   * List state in ascending order of 'name'.
   * @returns {Promise<State[]>}
   */
  list(countryId) {
    return this.find({country: countryId})
      .sort({ name: 1 })
      .exec();
  }
};

/**
 * @typedef state
 */
export default mongoose.model('State', StateSchema);
