import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import enums from '../constant/Enums';
import common from '../helpers/Common';
import config from "../../config/config";

/**
 * Category Schema
 */
const CategorySchema=new mongoose.Schema({
  categoryName: {type: String, default: ''},
  categoryImageName: {type: String, default: ''},
  isActive: {type: Boolean, default: true},
  isDeleted: {type: Boolean, default: false},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null}
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});

/**
  * Add your
  * - pre-save hooks
  * - pre-find hooks
  * - validations
  * - virtuals
 */
 CategorySchema.virtual('categoryImageUrl').get(function() {
   return `${config.categoryImageDirectoryUrl}/${this.categoryImageName}`;
 });

 /**
  * Methods
  */
 CategorySchema.method({
 });

/**
 * Statics
 */
 CategorySchema.statics = {
   /**
    * Get Category
    * @param {ObjectId} id - The objectId of user.
    * @returns {Promise<Category, APIError>}
    */
   get(id) {
     return this.findById(id)
       .exec()
       .then((category) => {
         if (category) {
           return category;
         }
         const err = new APIError('No such category exists!', httpStatus.NOT_FOUND);
         return Promise.reject(err);
       });
   },

   /**
    * List users in descending order of 'createdAt' timestamp.
    * @param {number} skip - Number of users to be skipped.
    * @param {number} limit - Limit number of users to be returned.
    * @returns {Promise<Category[]>}
    */
   list({ skip = 0, limit = 50 } = {}) {
     return this.find({isDeleted: false})
       .sort({ createdAt: -1 })
       .skip(+skip)
       .limit(+limit)
       .exec();
   }
 };

 /**
  * @typedef Category
  */
 export default mongoose.model('Category', CategorySchema);
