const Razorpay = require('razorpay')
const crypto = require('crypto')
const Payment = require('../models/Payment')
const Vendor = require('../models/Vendor')

const paymentController = {}

// Create Payment
paymentController.create = (req, res) => {
    const {amount, vendorId, paymentStatus, currency = 'INR'} = req.body

    Vendor.findById(vendorId)
    .then((vendor) => {
        if(!vendor){
            return res.json('Vendor not found')
        }
        const razorpayInstance = new Razorpay({
            key_id: vendor.razorpayKeyId,
            key_secret: vendor.razorpayKeySecret
        })

        const options = {
            amount: amount * 100,
            currency,
            receipt: `receipt_${Date.now()}`
        }

        return razorpayInstance.orders.create(options)
    })
    .then((order) => {
        const payment = new Payment({
            vendorId,
            razorpayOrderId: order.id,
            amount,
            currency,
            status: paymentStatus

        })
        return payment.save()

    })
    .then((payment) => res.status(201).json(payment))
    .catch((err) => res.status(500).json({ error: err.message }))

}

// List All Payments (Admin or System Use)
paymentController.list = (req, res) => {
    Payment.find({ isDelete: false })
        .populate('userId', '-password') // Populate user details without password
        .populate('orderId') // Populate order details
        .then((payments) => res.json(payments))
        .catch((err) => res.status(500).json({ error: err.message }))
}

// Get Payment by ID
paymentController.show = (req, res) => {
    const { id } = req.params

    Payment.findOne({ _id: id, isDelete: false })
        .populate('userId', '-password') // Populate user details
        .populate('orderId') // Populate order details
        .then((payment) => {
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' })
            }
            res.json(payment)
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}

// Update Payment (Admin/System Use)
paymentController.update = (req, res) => {
    const { id } = req.params
    const body = req.body

    Payment.findOneAndUpdate({ _id: id, isDelete: false }, body, { new: true, runValidators: true })
        .then((payment) => {
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' })
            }
            res.json(payment)
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}

// Delete Payment (Soft Delete)
paymentController.softDelete = (req, res) => {
    const { id } = req.params

    Payment.findOneAndUpdate({ _id: id }, { isDelete: true }, { new: true })
        .then((payment) => {
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' })
            }
            res.json({ message: 'Payment deleted successfully', payment })
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}

paymentController.verifyPayment = (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    Payment.findOne({razorpayOrderId})
    .populate('vendorId')
    .then((payment) => {
        if(!payment){
            return res.json('Payment not found')
        }
        const vendor = payment.vendorId

        const body = `${razorpayOrderId}|${razorpayPaymentId}`
        const expectedSignature = crypto
        .createHmac('sha256', vendor.razorpayKeySecret)
        .update(body)
        .digest('hex')

        if(expectedSignature !== razorpaySignature){
            return res.json('Invalid Signature')
        }

        payment.paymentStatus = 'paid'
        return payment.save()
    })
    .then((verifiedPayment) => {res.json('Payment verified ', verifiedPayment)})
    .catch((error) => {res.json(error.message)})
}

module.exports = paymentController
