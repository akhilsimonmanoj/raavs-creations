const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Orders'
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    razorpayOrderId: {
        type: String,
    },
    razorPaySignature: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    paymentMethod: {
        type: 'String',
        enum: ['card', 'upi', 'cod', 'netbanking', 'wallet', 'emi'],
    },
    paymentStatus: {
        type: String,
        enum: ['created', 'paid', 'pending', 'failed', 'refunded'],
        default: 'created'
    },
    transactionId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
        default: 'INR'
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment