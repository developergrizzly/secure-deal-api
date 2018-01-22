import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 *  Country Schema
 */
const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  dialCode: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: ''
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
CountrySchema.virtual('countryWithDialCode').get(function(){
  return `(${this.dialCode}) ${this.name}`;
});


/**
 * Statics
 */
CountrySchema.statics= {
  /**
   * List country in ascending order of 'name'.
   * @returns {Promise<Country[]>}
   */
  list() {
    return this.find()
      .sort({ name: 1 })
      .exec();
  }
};

/**
 * @typedef country
 */
export default mongoose.model('Country', CountrySchema);
