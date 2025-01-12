const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization').split()[1]
    let tokenData
    try {
        tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        User.findById(tokenData._id)
        .then((user) => {
            req.user = user
            next()
        })
        .catch((err) => {
            res.status(401).json(err)
        })
    } catch (error) {
        res.status(401).json('Error', error.message)
    }
}

module.exports = {authenticateUser}