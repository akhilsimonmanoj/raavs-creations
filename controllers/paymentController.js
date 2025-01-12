const Payment = require('../models/Payment')

const paymentController = {}

// Create Payment
paymentController.create = (req, res) => {
    const body = req.body

    const payment = new Payment(body)
    payment.save()
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

module.exports = paymentController
