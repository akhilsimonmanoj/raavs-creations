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
    paymentMethod: {
        type: 'String',
        enum: ['card', 'upi', 'cod'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment