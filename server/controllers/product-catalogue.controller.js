import ProductCatelouge from '../models/product-catalogue.model';
import FileUploader from '../helpers/FileUploader';
import Config from '../../config/config';
import Formidable from 'formidable';
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Get product catelouge
 * @return {ProductCatelouge}
 */
function get(req, res) {
  // TODO
}

/**
 * Create product catelouge
 * @param       {[type]}   req  [description]
 * @param       {[type]}   res  [description]
 * @param       {Function} next [description]
 * @return {ProductCatelouge}
 */
function create(req, res, next) {
  let destinationPath = Config.ftpPath.productCatalogueCoverImagePath,
  form = new Formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let productCatelouge= new ProductCatelouge({
      name: fields.name,
      startingAt: fields.startingAt,
      categroy: fields.categroy,
      vendor: fields.vendor,
      description: JSON.parse(fields.description),
      createdBy: req.userId
    });
    return FileUploader.upload(files, destinationPath, productCatelouge._id)
      .then(function (result) {
        if(result.isSucceeded && result.isFileExists) {
          productCatelouge.catelougeImageFileName= result.fileName;
          return productCatelouge.save()
            .then((savedProductCatelouge) => res.json(savedProductCatelouge))
            .catch((err) => next(err));
        } else {
          return next(new APIError('Failed to create product catelouge due file uploading Failed',
            HttpStatus.INTRRNAL_SERVER_ERROR))
        }
      });
  });
}

/**
 * Update product catelouge
 * @param       {[type]}   req  [description]
 * @param       {[type]}   res  [description]
 * @param       {Function} next [description]
 * @constructor
 */
function update(req, res, next) {
  // TODO
}

/**
 * Remove product catelouge
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function remove(req, res, next) {

}

/**
 * Get all product caatelog
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return ProductCatelouge.list({ limit, skip })
    .then(productCatelouge => res.json({
      productCatelouge
    }))
    .catch(e => next(e));
}

export default { get, create, update, list, remove };
