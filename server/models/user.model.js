import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import enums from '../helpers/Enums'
import common from '../helpers/Common';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  emailAddress: {
    type: String
  },
  password: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  isProfileCompleted: {
    type: Boolean,
    default: false
  },
  isEmailAddressConfirmed: {
    type: Boolean,
    default: false
  },
  loginType: {
    type: String,
    enum: enums.REGISTER_TYPE,
    required: true
  },
  profileImageURL: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function(next) {
  this.isProfileCompleted =
    !common.isNullOrEmpty(this.get('firstName'))
    && !common.isNullOrEmpty(this.get('lastName'))
    && !common.isNullOrEmpty(this.get('emailAddress'));
  next();
});

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
