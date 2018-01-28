import countryCtrl from '../controllers/country.controller';
import express from "express";

const router = express.Router();

router.route('/')
  // GET /country - get all country
  .get(countryCtrl.list)
  // POST /country - create country
  .post(countryCtrl.create);
export default router;
