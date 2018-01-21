import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/login/facebook')
  .post(authCtrl.loginWithFacebook);

router.route('/login/google')
  .post(authCtrl.loginWithGoogle);

router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register);


export default router;
