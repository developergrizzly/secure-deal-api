import User from '../models/user.model';
import FileUploader from '../helpers/FileUploader';
import Config from '../../config/config';
import Formidable from 'formidable';
import HttpStatus from 'http-status';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @property {string} req.body.emailAddress - The email address of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: req.body.password,
    mobileNumber: req.body.mobileNumber
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.firstName - The firstName of user.
 * @property {string} req.body.lastName - The lastName of user.
 * @property {string} req.body.emailAddress - The email address of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.firstName = req.body.username;
  user.lastName = req.body.lastName;
  user.emailAddress = req.body.lastName;
  user.mobileNumber = req.body.lastName;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

/**
 * Upload user's profile image
 * @return {message}
 */
function uploadUserProfileImage(req, res, next) {
  let destinationPath = Config.ftpPath.userProfileImage,
    fileId = req.params.userId,
    form = new Formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if(!files || !files.file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message : 'File is required'
      });
    }
    FileUploader.upload(files, destinationPath, fileId)
      .then(function (result) {
        return User.findByIdAndUpdate(req.params.userId)
          .then((user)=>{
            user.profileImageFileName= result.fileName;
            return user.save()
              .then((savedUser) => res.json(savedUser));
          }).catch(err => next(err));
      }).catch(err => next(err));
  });
}

export default { load, get, create, update, list, remove, uploadUserProfileImage };
