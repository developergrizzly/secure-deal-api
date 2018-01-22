import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/login/facebook')
  .post(authCtrl.loginWithFacebook);

router.route('/login/google')
  .post(authCtrl.loginWithGoogle);

router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register);


export default router;
