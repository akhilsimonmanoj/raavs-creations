const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product Name is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    stock: {
        type: Number,
        required: [true, 'Strock Quantity is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    imageUrl: [{
        type: String
    }],
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [{
        type: String
    }],
    ratings: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    isDelete: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const Products = mongoose.model('Products', productSchema)
module.exports = Products