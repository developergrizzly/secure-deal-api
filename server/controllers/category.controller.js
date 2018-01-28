import Category from '../models/category.model';
import User from '../models/user.model';
import FileUploader from '../helpers/FileUploader';
import Config from '../../config/config';
import Formidable from 'formidable';
import HttpStatus from 'http-status';

/**
 * Get category
 * @returns {Category}
 */
function get(req, res, next) {
  return Category.findById(req.params.categoryId)
    .then((category) => {
      return res.json(category);
    })
    .catch(e => next(e));
}

/**
 * Create new category
 * @property {string} req.form.categoryName - The name of the category.
 * @property {files} req.form.file - The image file of category.
 * @return {category}
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
    if(!files || !files.file || !files.file.path) {
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
 * @property {string} req.form.categoryName - The name of category.
 * @property {files} req.file.file - The image file of category.
 * @property {boolean} req.form.isActive - The is active of category.
 * @return {category}
 */
function update(req, res, next) {
  let form = new Formidable.IncomingForm(),
    destinationPath = Config.ftpPath.categoryImagePath,
    categoryId= req.params.categoryId;
  form.parse(req, (err, fields, files) => {
    return Category.findById(categoryId)
      .then((category) => {
        if(category) {
          let fileId= category._id;
          return FileUploader.upload(files, destinationPath, fileId)
          .then(function(result) {
            if(result.isSucceeded && result.isFileExists) {
              category.categoryImageName= result.fileName;
            }
            category.categoryName= fields.categoryName;
            category.isActive= fields.isActive;
            return category.save()
              .then((savedCategory) => {
                return res.json(savedCategory);
              }).catch((err) => next(err));
          })
        } else {
          return res.json({
            message: "Category not found"
          });
        }
      }).catch(err => next(err));
  });
}

/**
 * Get category list
 * @return {[category]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return Category.list({ limit, skip })
    .then(category => res.json({
      categories: category
    }))
    .catch(e => next(e));
}

/**
 * Delete category
 * @property {string} req.form.categoryId - The id of category.
 */
function remove(req, res, next) {
    let categoryId= req.params.categoryId;
    return Category.update(categoryId, {isDeleted: true})
    .then(deletedCategory => res.json({
      message: "Category is removed"
    }))
    .catch(e => next(e));
}

export default { get, create, update, list, remove };
