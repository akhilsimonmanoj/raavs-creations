const User = require('../models/User')

const protect = (req, res, next) => {
    const user = req.user

    if(!user){
        return res.json('Authorization Failed')
    }

    if(user.role !== 'admin'){
        return res.json('Access denied. Contact your administrator.')
    }
}

module.exports = {protect}