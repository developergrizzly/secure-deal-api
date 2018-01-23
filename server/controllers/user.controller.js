import User from '../models/user.model';
import fileManger from '../helpers/FileManager';
import config from '../../config/config';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
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
 * @property {string} req.body.username - The username of user.
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
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

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

function uploadUserProfileImage(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let sourceFilename= files.file.path,
      fileExtension = files.file.name.split('.').pop();
    let temp=path.join(`${__basedir}/.temp-image/${req.params.userId}.${fileExtension}`);
    let destinationFileName=`${config.ftpPath.userProfileImage}/${req.params.userId}.${fileExtension}`;
    fs.readFile(sourceFilename, function(err, data) {
      fs.writeFile(temp, data, function(err) {
        fileManger.upload(temp, destinationFileName)
          .then(dirList => {
            fs.unlink(temp, function(err) {
              res.json(dirList)
            });
          }).catch(e => next(e));
      });
    });
  });

}

export default { load, get, create, update, list, remove, uploadUserProfileImage };
