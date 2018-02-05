import Product from '../models/product.model';
import User from '../models/user.model';
import FileUploader from '../helpers/FileUploader';
import Config from '../../config/config';
import Formidable from 'formidable';
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Promise from 'bluebird';

function get(req, res, next) {
  return Product.findById(req.params.productId)
    .then((product) => res.json(product))
    .catch((err) => next(err));
}

function create(req, res, next) {
  let form = new Formidable.IncomingForm(),
    destinationPath = Config.ftpPath.productImagePath;
  form.multiples= true;
  form.parse(req, (err, fields, files)=> {
    let product=new Product({
      productCatelouge: fields.productCatelouge,
      weight: fields.weight,
      price: fields.price,
      stock: fields.stock,
      SKUnumber: fields.SKUnumber,
      createdBy: req.userId
    });
    let filePromise =[], fileNames = [], fileId;
    for(let i=0; i<files.file.length; i++) {
      fileId= `${product._id}_${i}`;
      filePromise.push(FileUploader.upload(files.file[i], destinationPath, fileId)
        .then((result) =>{
          fileNames.push(result.fileName);
        })
      );
    }

    return Promise.all(filePromise)
      .then(() =>{
        product.productImageFileNames= fileNames;
        return product.save()
        .then((savedProduct)=> {
          return res.json(savedProduct);
        })
        .catch((err)=> next(err));
      })
      .catch((err)=> next(err));;
  });
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Product.list({ limit, skip })
    .then(products => res.json({
      products
    }))
    .catch(e => next(e));
}

function getCatelogueProduct(req, res, next) {
  return Product.getCatelogueProduct(req.params.catelougeId)
    .then(products => res.json({
      products
    }))
    .catch(e => next(e));
}

export default { get, create, list, getCatelogueProduct };
