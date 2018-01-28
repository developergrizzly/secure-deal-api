import express from 'express';
import validate from 'express-validation';
import categoryCtrl from '../controllers/category.controller';

const router = express.Router();

router.route('/')
  // GET /api/category - Get all the category
  .get(categoryCtrl.list)
  //PSOT /api/category - Create category
  .post(categoryCtrl.create);

router.route('/:categoryId')
  // GET /api/category/:categoryId - Get category by id
  .get(categoryCtrl.get)
  // PUT /api/category/:categoryId - Update category
  .put(categoryCtrl.update)
  // DELETE /api/category/:categoryId - Delete category
  .delete(categoryCtrl.remove);

export default router;
