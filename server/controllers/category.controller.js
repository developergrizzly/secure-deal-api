import Category from '../models/category.model';
import User from '../models/user.model';
import FileUploader from '../helpers/FileUploader';
import Config from '../../config/config';
import Formidable from 'formidable';
import HttpStatus from 'http-status';

/**
 * Load user and append req
 */
function load(req, res, next, id) {

}

/**
 * Get category
 * @returns {Category}
 */
function get(req, res, next, id) {
  return Category.get(id)
    .then((category) => {
      return res.json(category);
    })
    .catch(e => next(e));
}

/**
 * Create new category
 */
function create(req, res, next){
  let form = new Formidable.IncomingForm(),
    destinationPath = Config.ftpPath.categoryImagePath;
  form.parse(req, (err, fields, files) => {
    if(!fields || !fields.categoryName) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message : 'Category name is required'
      });
    }
    if(!files || !files.file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message : 'Category image is required'
      });
    }
    let category= new Category({
      categoryName: fields.categoryName
    });
    let fileId= category._id;
    return FileUploader.upload(files, destinationPath, fileId)
      .then((result) =>{
        category.categoryImageName= result.fileName;
        return category.save()
        .then((savedCategory) =>{
          return res.json(savedCategory);
        }).catch((err) => next(err));
      }).catch((err) => next(err));
  });
}

/**
 * Update existing category
 */
function update(req, res, next) {

}

/**
 * Get category list
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Category.list({ limit, skip })
    .then(category => res.json(category))
    .catch(e => next(e));
}

/**
 * Delete category
 */
function remove(req, res, next) {

}

export default { get, create, update, list, remove };
