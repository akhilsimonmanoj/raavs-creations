const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vendorSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    razorpayKeyId: {
        type: String
    },
    razorpayKeySecret: {
        type: String
    },
    isActive: {
        type: Boolean
    }
}, {timestamps: true})

const Vendor = mongoose.model('Vendor', vendorSchema)
module.exports = Vendor