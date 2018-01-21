import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      emailAddress: Joi.string().email().required(),
      mobileNumber: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      emailAddress: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      firstName: Joi.string(),
      lastName: Joi.string(),
      emailAddress: Joi.string().email(),
      mobileNumber: Joi.string(),
      password: Joi.string(),
      loginType: Joi.string().required()
    }
  }
};
