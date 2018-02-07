import DeliveryAddress from '../models/delivery-address.model';
import Config from '../../config/config';
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';

function get(req, res, next) {
  return DeliveryAddress.get(req.params.deliveryAddressId)
    .then((deliveryAddress) => {
      return res.json(deliveryAddress);
    })
    .catch(e => next(e));
}

function create(req, res, next) {
  let deliveryAddress= new DeliveryAddress({
      userId: req.user._id,
      name: req.body.name,
      address: {
        address1: req.body.address.address1,
        address2:  req.body.address.address2
      },
      pincode: req.body.pincode,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      mobileNumber: req.body.mobileNumber,
      createdBy: req.user._id
  });
  console.log(deliveryAddress);
  return deliveryAddress.save()
    .then((savedDeliveryAddress)=> {
      return res.json(savedDeliveryAddress);
    }).catch((err) => next(err));
}

function update(req, res, next) {
  let deliveryAddress= req.body;
  deliveryAddress.updatedBy= req.user._id;
  deliveryAddress.updatedAt= new Date();
  return DeliveryAddress.update({_id: req.params.deliveryAddressId}, deliveryAddress)
    .then((result) => {
      return DeliveryAddress.find({_id: req.params.deliveryAddressId})
        .then(deliveryAddress => res.json(deliveryAddress))
        .catch(err => next(err));
    }).catch((err) => next(err));
}

function remove(req, res, next) {
  let deliveryAddressId= req.params.deliveryAddressId;
  return DeliveryAddress.update(deliveryAddressId, {isDeleted: true})
  .then(deletedDeliveryAddress => res.json({
    message: "Delivery address is removed"
  }))
  .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  return DeliveryAddress.list({ limit, skip })
    .then(deliveryAddress => res.json({
      deliveryAddress
    }))
    .catch(e => next(e));
}

function listByUserId(req, res, next) {
  let userId=req.user._id;
  return DeliveryAddress.listByUserId(userId)
    .then(deliveryAddress => res.json({
      deliveryAddress
    }))
    .catch(e => next(e));
}

export default { get, create, update, list, remove, listByUserId };
