const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comments: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Reviews = mongoose.model('Reviews', reviewSchema)
module.exports = Reviews