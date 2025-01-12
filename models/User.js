const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [2, 'Name must be minimum 2 characters long'],
        maxLength: [64, 'Name must be maximum 64 characters long']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        validate: {
            validator: function(value){
                return isEmail(value)
            },
            message: function(){
                return 'invalid Email'
            }
        }
    },
    password: {
        type: String,
        minLength: [8, 'Password must be minimum 8 characters'],
        maxLength: [64, 'Password must be maximum 64 characters'],
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'seller'],
        default: 'user'
    },
    address: {
        street: {
            type: String,
            
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
            
        }
    },
    phone: {
        type: Number,
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }],
    orderHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Orders'
    }],
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

userSchema.pre('save', function(next){
    const user = this
    bcryptjs.genSalt()
    .then((salt) => {
        bcryptjs.hash(user.password, salt)
        .then((encrypted) => {
            user.password = encrypted
            next()
        })
    })
})

const User = mongoose.model('User', userSchema)
module.exports = User