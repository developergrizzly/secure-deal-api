import cityCtrl from '../controllers/city.controller';
import express from "express";

const router = express.Router();

router.route('/:stateId')
  // GET /country - get all country
  .get(cityCtrl.list)

router.route('/')
  // POST /country - create country
  .post(cityCtrl.create);
export default router;
