import deliveryAddressCtrl from '../controllers/delivery-address.controller';
import express from "express";

const router = express.Router();

router.route('/')
  // GET /deliveryAddress - get all deliveryAddress
  .get(deliveryAddressCtrl.list)
  // POST /deliveryAddress - create deliveryAddress
  .post(deliveryAddressCtrl.create);

router.route('/address-by-user-id')
    // GET /deliveryAddress - get all deliveryAddress
    .get(deliveryAddressCtrl.listByUserId);

router.route('/:deliveryAddressId')
  // GET /deliveryAddress - get by deliveryAddress id
  .get(deliveryAddressCtrl.get)
  // PUT /deliveryAddress - put by deliveryAddress id
  .put(deliveryAddressCtrl.update)
  // DELETE /deliveryAddress - remove deliveryAddress
  .delete(deliveryAddressCtrl.remove);


export default router;
