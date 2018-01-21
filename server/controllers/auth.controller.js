import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from "../models/user.model";
import bcrypt from 'bcrypt-nodejs';

// sample user, used for authentication
const user = {
  username: 'react',
  password: 'express'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  let loginCredentials= {
    emailAddress: req.body.emailAddress,
    password: req.body.password
  };

  User.findOne({
    emailAddress: loginCredentials.emailAddress
  }).exec()
    .then((user) => {
      console.log(user);
      if(!user) {
        return next(new APIError('No user found', httpStatus.UNAUTHORIZED, true));
      }
      if(!bcrypt.compareSync(loginCredentials.password, user.password)) {
        return next(new APIError('Wrong password', httpStatus.UNAUTHORIZED, true));
      }
      let token = jwt.sign(user, config.jwtSecret);
      return res.json({
        token
      });
    });
}

function loginWithFacebook(req, res, next) {

}

function loginWithGoogle(req, res, next) {

}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function register(req, res, next) {

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: bcrypt.hashSync(req.body.password, null, null),
    mobileNumber: req.body.mobileNumber,
    loginType: req.body.loginType
  });

  User.count({
    emailAddress: req.body.emailAddress
  }).exec()
    .then((numberOfUser) => {
      if(numberOfUser > 0) {
        return next(new APIError('Email address already exists', httpStatus.CONFLICT, true))
      } else {
        user.save()
          .then(savedUser => res.json(savedUser))
          .catch(e => next(e));
      }
  })
}

export default { login, loginWithFacebook, loginWithGoogle, register };
