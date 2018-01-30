import stateCtrl from '../controllers/state.controller';
import express from "express";

const router = express.Router();

router.route('/:countryId')
  // GET /country - get all country
  .get(stateCtrl.list)

router.route('/')
  // POST /country - create country
  .post(stateCtrl.create);
export default router;
