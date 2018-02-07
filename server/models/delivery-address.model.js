import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 *  DeliveryAddress Schema
 */
const DeliveryAddressSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  address: {
    address1: {type: String, required: true},
    address2: {type: String, required: true}
  },
  pincode: {type: String, required: true},
  country: {type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true},
  state: {type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true},
  city: {type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true},
  mobileNumber: {type: String, required: true},
  isActive: {type:Boolean, default: true},
  isDeleted: {type:Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  updatedAt: {type: Date},
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

 DeliveryAddressSchema.pre('findById',  populateReferences)
    .pre('find', populateReferences);

 function populateReferences() {
    return this.populate('createdBy', 'firstName lastName')
     .populate('updatedBy', 'firstName lastName')
     .populate('country')
     .populate('state')
     .populate('city');
 }

 /**
  * Statics
  */
 DeliveryAddressSchema.statics= {
   /**
    * Get  delivery address
    * @param {ObjectId} id - The objectId of user.
    * @returns {Promise<DeliveryAddress, APIError>}
    */
   get(id) {
     return this.findById(id)
       .exec()
       .then((deliveryAddress) => {
         if (deliveryAddress) {
           return deliveryAddress;
         }
         const err = new APIError('No such delivery address exists!', HttpStatus.NOT_FOUND);
         return Promise.reject(err);
       });
   },

   /**
    * List delivery address in descending order of 'createdAt' timestamp.
    * @param {number} skip - Number of product to be skipped.
    * @param {number} limit - Limit number of product to be returned.
    * @returns {Promise<DeliveryAddress[]>}
    */
   list({ skip = 0, limit = 50 } = {}) {
     return this.find({isDeleted: false})
       .sort({ createdAt: -1 })
       .skip(+skip)
       .limit(+limit)
       .exec();
   },

   /**
    * List delivery address by userId in descending order of 'createdAt' timestamp.
    * @param {number} skip - Number of product to be skipped.
    * @param {number} limit - Limit number of product to be returned.
    * @returns {Promise<DeliveryAddress[]>}
    */
   listByUserId(userId) {
     return this.find({userId: userId, isDeleted: false})
       .sort({ createdAt: -1 })
       .exec();
   }
 };

 /**
  * @typedef DeliveryAddress
  */
 export default mongoose.model('DeliveryAddress', DeliveryAddressSchema);
