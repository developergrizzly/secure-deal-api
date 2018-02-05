import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from "../../config/config";
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';
import ProductDetail from './product-detail.model';

/**
 * Product Schema
 */
const ProductSchema= new mongoose.Schema({
  productCatelouge: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductCatelouge', required: true},
  productImageFileNames: [{type: String, required: true}],
  weight: {type: Number, required: true},
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  SKUnumber: {type: String, required: true},
  //categroy: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}],
  //description: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetail', required: true},
  sharing: {type: Number, default: 0},
  isOutofStock: {type: Boolean, default: true},
  isCODAvailable : {type: Boolean, default: true},
  isReturnAccepted: {type: Boolean, default: true},
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
ProductSchema.pre('findById',  populateReferences)
   .pre('find', populateReferences);

ProductSchema.virtual('productImageUrl').get(function() {
  let fileUrls=[];
  for(let i=0; i<this.productImageFileNames.length; i++) {
    fileUrls.push(`${config.productImageUrl}/${this.productImageFileNames[i]}`)
  }
 return fileUrls;
});

function populateReferences() {
   return this.populate('createdBy', 'firstName lastName')
    .populate('updatedBy', 'firstName lastName')
    .populate('productCatelouge', 'description');
}

 /**
  * Statics
  */
 ProductSchema.statics= {
   /**
    * Get Product
    * @param {ObjectId} id - The objectId of user.
    * @returns {Promise<Product, APIError>}
    */
   get(id) {
     return this.findById(id)
       .exec()
       .then((product) => {
         if (product) {
           return product;
         }
         const err = new APIError('No such product exists!', HttpStatus.NOT_FOUND);
         return Promise.reject(err);
       });
   },

   /**
    * List product in descending order of 'createdAt' timestamp.
    * @param {number} skip - Number of product to be skipped.
    * @param {number} limit - Limit number of product to be returned.
    * @returns {Promise<Product[]>}
    */
   list({ skip = 0, limit = 50 } = {}) {
     return this.find()
       .sort({ createdAt: -1 })
       .skip(+skip)
       .limit(+limit)
       .exec();
   },

  getCatelogueProduct(catelougeId) {
    return this.find({productCatelouge:  catelougeId})
      .exec()
      .then((products)=> {
        if (products) {
          return products;
        }
        const err = new APIError('No such product exists!', HttpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
 };

 /**
  * @typedef Product
  */
 export default mongoose.model('Product', ProductSchema);
