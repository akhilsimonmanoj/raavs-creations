const Order = require('../models/Order')
const Products = require('../models/Product')

exports.create = (req, res) => {
    const body = req.body
    const order = new Order(body)
    order.save()
    .then((newOrders) => {res.json('Order Created ', newOrders)})
    .catch((error) => {res.json('Error creating new order ', error.message)})
}

exports.list = (req, res) => {
    const {status} = req.query
    const filter = status ? {status} : {}
    Order.find(filter)
    .populate('userId', '-password')
    .populate({
        path: Products,
        populate: {
            path: 'productId'
        }
    })
    .populate('status')
    .then((order) => {res.json(order)})
    .catch((error) => {res.json(error.message)})
}

exports.show = (req, res) => {
    const id = req.params.id
    Order.findOne({_id: id})
    .populate('userId', '-password')
    .populate({
        path: Products,
        populate: {
            path: 'productId'
        }
    })
    .populate('status')
    .then((order) => {
        if(!order){
            res.json('Order not found')
        }
        res.json(order)
    })
    .catch((error) => {res.json(error.message)})
}

exports.update = (req, res) => {
    const id = req.params.id
    const updates = req.body
    Order.findByIdAndUpdate(id, updates, {new: true, runValidators: true})
    .populate('userId', '-password')
    .populate({
        path: Products,
        populate: {
            path: 'productId'
        }
    })
    .populate('status')
    .then((order) => {res.json('Order updated ', order)})
    .catch((error) => {res.json('Error updating order ', error.message)})
}