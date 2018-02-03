import productCatalogueCtrl from '../controllers/product-catalogue.controller';
import productCtrl from '../controllers/product.controller';
import express from "express";

const router = express.Router();

router.route('/')
  // GET /productcatalogue - get all product catelouge
  .get(productCatalogueCtrl.list)
  // POST /productcatalogue - create country
  .post(productCatalogueCtrl.create);

router.route('/:catelougeId')
  // GET /productcatalogue - get all country
  .get(productCatalogueCtrl.get)
  // PUT /productcatalogue - update product catelouge
  .put(productCatalogueCtrl.update)
  // DELETE /productcatalogue - delete product catelouge
  .delete(productCatalogueCtrl.remove);

router.route('/:catelougeId/products')
  .get(productCtrl.getCatelogueProduct)

export default router;
