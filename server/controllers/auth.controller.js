import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from "../models/user.model";
import bcrypt from 'bcrypt-nodejs';

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
    if(!user) {
      return next(new APIError('No user found', httpStatus.UNAUTHORIZED, true));
    }
    if(!bcrypt.compareSync(loginCredentials.password, user.password)) {
      return next(new APIError('Wrong password', httpStatus.UNAUTHORIZED, true));
    }
    let token = jwt.sign({_id:user._id}, config.jwtSecret);
    return res.json({
      message: "Login successfully",
      token: token,
      _id: user._id
    });
  });
}

function loginWithFacebook(req, res, next) {
  const user = new User({
    socialMediaId: req.body.socialMediaId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    profileImageURL: req.body.profileImageURL,
    loginType: req.body.loginType
  });
  User.findOne({
    socialMediaId: user.socialMediaId
  }).exec()
  .then((foundUser) => {
    if(foundUser) {
      let token = jwt.sign({_id:foundUser._id}, config.jwtSecret);
      return res.json({
        message: "Login successfully",
        token: token,
        _id: foundUser._id
      });
    } else {
      return user.save()
      .then((savedUser) => {
        let token = jwt.sign({_id:savedUser._id}, config.jwtSecret);
        return res.json({
          message: "Login successfully",
          token: token,
          _id: savedUser._id
        });
      })
    }
  })
  .catch(e => next(e));
}

function loginWithGoogle(req, res, next) {
  const user = new User({
    socialMediaId: req.body.socialMediaId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    profileImageURL: req.body.profileImageURL,
    loginType: req.body.loginType
  });
  User.findOne({
    socialMediaId: user.socialMediaId
  }).exec()
    .then((foundUser) => {
      if(foundUser) {
        let token = jwt.sign({_id:foundUser._id}, config.jwtSecret);
        return res.json({
          message: "Login successfully",
          token: token,
          _id: foundUser._id
        });
      } else {
        return user.save()
          .then((savedUser) => {
            let token = jwt.sign({_id:savedUser._id}, config.jwtSecret);
            return res.json({
              message: "Login successfully",
              token: token,
              _id: savedUser._id
            });
          })
      }
    })
    .catch(e => next(e));
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
    loginType: req.body.loginType,
    country: req.body.country
  });

  User.count({
    emailAddress: req.body.emailAddress
  }).exec()
    .then((numberOfUser) => {
    if(numberOfUser > 0) {
      return next(new APIError('Email address already exists', httpStatus.CONFLICT, true))
    } else {
      return user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
    }
  }).catch(e => next(e));
}

export default { login, loginWithFacebook, loginWithGoogle, register };
