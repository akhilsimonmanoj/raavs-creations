const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ordersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number
        },
        priceAtPurchase: {
            type: Number
        }
    }],
    totalPrice: {
        type: Number,
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingAddress: {
        address: {
            type: String
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zipcode: {
            type: Number,
            min: 5,
            max: 6
        }
    }
    ,
    orderDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Order = mongoose.model('Order', ordersSchema)
module.exports = Order