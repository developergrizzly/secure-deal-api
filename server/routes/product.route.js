import productCtrl from '../controllers/product.controller';
import express from "express";

const router = express.Router();

router.route('/')
  .get(productCtrl.list)
  .post(productCtrl.create);

router.route('/:productId')
  // GET /productcatalogue - get all country
  .get(productCtrl.get)

export default router;
