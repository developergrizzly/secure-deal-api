import countryCtrl from '../controllers/country.controller';
import express from "express";

const router = express.Router();

router.route('/')
  .get(countryCtrl.list);

export default router;
