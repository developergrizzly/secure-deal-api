import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from "../../config/config";

/**
 * Product catelouge Schema
 */

const ProductCatelougeSchema= new mongoose.Schema({
  name: {type: String, required: true},
  catelougeImageFileName: {type: String, required: true},
  startingAt: {type: Number, required: true},
  categroy: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  numberOfSharig: {type: Number, default: 0},
  isOutofStock: {type: Boolean, default: false},
  description: {
    fabric: {type: String},
    size: {type: String},
    length: {type: String},
    work: {type: String},
    type: {type: String},
    availability: {type: String},
    occasion : {type: String},
    washcare :{type: String}
  },
  isActive: {type:Boolean, default: true},
  isDeleted: {type:Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  updatedAt: {type: Date},
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
 ProductCatelougeSchema.pre('findById',  populateReferences)
   .pre('find', populateReferences);

ProductCatelougeSchema.virtual('productCatalogueCoverImageUrl').get(function() {
 return `${config.productCatalogueCoverImageUrl}/${this.catelougeImageFileName}`;
});

function populateReferences() {
   return this.populate('createdBy', 'firstName lastName')
    .populate('updatedBy', 'firstName lastName')
    .populate('vendor', 'vendorName');
}

/**
 * Statics
 */
ProductCatelougeSchema.statics= {
  /**
   * Get Product catelouge
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<ProductCatelouge, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((productCatelouge) => {
        if (productCatelouge) {
          return productCatelouge;
        }
        const err = new APIError('No such product catelouge exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List product catelouge in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of product catelouge to be skipped.
   * @param {number} limit - Limit number of product catelouge to be returned.
   * @returns {Promise<ProductCatelouge[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
}

/**
 * @typedef ProductCatelouge
 */
export default mongoose.model('ProductCatelouge', ProductCatelougeSchema);
