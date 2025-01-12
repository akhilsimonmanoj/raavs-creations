const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statusSchema = new Schema({
    name: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Status = mongoose.model('Status', statusSchema)
module.exports = Status