const Product = require('../models/Product')
const productController = {}

productController.create = (req, res) => {
    const body = req.body 
    Product.findOne({name: req.name, isDelete: true})
    .then((existingProduct) => {
        if(existingProduct){
            existingProduct.isDelete = false
            return existingProduct.save()
        } else {
            const product = new Product(body)
            product.save()
        }
    })
    .then((product) => {res.json('Product Created ', product)})
    .catch((error) => {res.json('Error creating product ', error.message)})
}

productController.list = (req, res) => {
    Product.find({isDelete: false})
    .populate('category')
    .populate('seller')
    .populate({
        path: 'ratings',
        populate: {
            path: 'userId'
        }
    })
    .then((product) => {res.json('All Products ', product)})
    .catch((error) => {res.json('Error fetching products ', error.message)})
}

productController.show = (req, res) => {
    const id = req.params.id
    Product.findOne({_id: id, isDelete: false})
    .populate('category')
    .populate('seller')
    .populate({
        path: 'ratings',
        populate: {
            path: 'userId'
        }
    })
    .then((product) => {res.json('Selected Product ', product)})
    .catch((error) => {res.json(error.message)})
}

productController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Product.findOneAndUpdate({_id: id, isDelete: false}, body, {new: true, runValidators: true})
    .then((product) => {res.json(product)})
    .catch((error) => {res.json(error.message)})
}

productController.destroy = (req, res) => {
    const id = req.params.id
    Product.findByIdAndUpdate(id, {isDelete: true}, {new: true, runValidators: true})
    .then((product) => {
        if(!product){
            return res.json('Product not found')
        }
        res.json('Product Deleted ', product)
    })
    .catch((error) => {res.json('Error deleting product ', error.message)})
}

module.exports = productController