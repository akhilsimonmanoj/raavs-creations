const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userController = {}
const nodemailer = require('nodemailer')

//Register a new account || Restore a Deleted Account
userController.register = (req, res) => {
    const body = req.body

    User.findOne({email: body.email, isDelete: true})
    .then((existingUser) => {
        if(existingUser){
            existingUser.isDelete = false
            existingUser.name = body.name || existingUser.name
            existingUser.password = body.password

            return existingUser.save()
            .then((restoredUser) => {
                res.json(restoredUser)
            })
            .catch((error) => {
                res.json(error)
            })
        }
    })
    const user = new User(body)
    user.save()
    .then((user) => {
        res.json(user)
    })
    .catch((err) => {
        res.json(err)
    })
}

//Login to the account
userController.login = (req, res) => {
    const body = req.body
    User.findOne({email: body.email})
    .then((user) => {
        if(!user){
            res.json({error: 'Invalid email or password'})
        }
        bcryptjs.compare(body.password, user.password)
        .then((match) => {
            if(match){
                const tokenData = {
                    _id: user._id,
                    username: user.name,
                    phone: user.phone,
                    email: user.email
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
                res.json({token: token})
            } else {
                res.json({error: 'Invalid email or password'})
            }
        })

    })
}

//Update the account
userController.updateAccount = (req, res) => {
    const userId = req.user._id
    const body = req.body

    const allowedUpdates = ['name', 'email', 'phone']
    const updates = Object.keys(body).filter((key) => allowedUpdates.includes(key))

    if(updates.length === 0){
        return res.status(401).json('Invalid Updates')
    }

    User.findByIdAndUpdate(userId, {$set: body}, {new: true, runValidators: true})
    .then((updatedUser) => {
        if(updatedUser){
            res.json((updatedUser))
        } else {
            res.status(404).json('User not found')
        }
    })
    .catch((err) => {
        res.json(err.message)
    })
}

//Change password
userController.changePassword = async (req, res) => {
    const userId = req.user._id
    const {oldPassword, newPassword } = req.body

    try {
        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json('User not found')
        }

        const isMatch = await bcryptjs.compare(oldPassword, newPassword)
        if(!isMatch){
            res.status(401).json('Old password is incorrect')
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        res.json({message: 'Password updated successfully'})
    } catch (error) {
        res.json({error: error.message})
    }
}

//Reset Password
userController.forgotPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json('User not found')
        }

        const resetToken = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_ID,
                password: process.env.EMAIL_PASS,
            }
        })

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Password reset request',
            html:`<p>You requested a password reset. Click <a href=${resetLink}>here</a> to reset your password.</p>`
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json('Password reset link has been sent to your email')
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Get Account Details
userController.getAccount = (req, res) => {
    res.json(req.user)
}

// Delete User Account
userController.deleteUser = async (req, res) => {
    const userId = req.user._id
    try {
        
        const user = await User.findById(userId)
        if(!userId){
            res.json('User not found')
        }

        if(user.isDelete){
            res.json('User already deleted')
        }

        user.isDelete = true
        await user.save()

        res.json({message: 'User deleted successfully'})
    } catch (error) {
        res.status(401).json('Something went wrong ', error.message)
    }
}

module.exports = userController