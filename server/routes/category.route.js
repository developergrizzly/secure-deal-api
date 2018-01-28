import express from 'express';
import validate from 'express-validation';
import categoryCtrl from '../controllers/category.controller';

const router = express.Router();

router.route('/')
  .get(categoryCtrl.list)
  .post(categoryCtrl.create);

export default router;
