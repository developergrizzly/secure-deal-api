import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from "../../config/config";
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Product Detail Schema
 */
const ProductDetailSchema= new mongoose.Schema({
  fabric: {type: String, required: true},
  size: {type: String, required: true},
  length: {type: String, required: true},
  work: {type: String, required: true},
  type: {type: String, required: true},
  availability: {type: String, required: true},
  occasion : {type: String, required: true},
  washcare :{type: String, required: true}
}, {toObject: {virtuals: true}, toJSON: {virtuals: true}});


/**
 * @typedef ProductDetail
 */
export default mongoose.model('ProductDetail', ProductDetailSchema);
