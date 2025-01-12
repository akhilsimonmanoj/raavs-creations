const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number,
        }
    },
    totalPrice: {
        type: Number
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart