const Vendor = require('../models/Vendor')
const vendorController = {}

vendorController.create = (req, res) => {
    const { name, razorpayKeyId, razorpayKeySecret } = req.body

    const vendor = new Vendor({ name, razorpayKeyId, razorpayKeySecret })

    vendor.save()
    .then((vendor) => {res.json('Vendor Created ', vendor)})
    .catch((error) => {res.json('Error creating vendor ', error.message)})
}

vendorController.list = (req, res) => {
    Vendor.find({ isDelete: false })
        .then((vendors) => res.status(200).json(vendors))
        .catch((err) => res.status(500).json({ error: err.message }))
}

vendorController.update = (req, res) => {
    const { id } = req.params
    const updateData = req.body

    Vendor.findByIdAndUpdate(id, updateData, { new: true })
        .then((updatedVendor) => {
            if (!updatedVendor) {
                return res.status(404).json({ message: 'Vendor not found' })
            }
            res.status(200).json(updatedVendor)
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}

vendorController.destroy = (req, res) => {
    const { id } = req.params

    Vendor.findByIdAndUpdate(id, { isDelete: true }, { new: true })
        .then((deletedVendor) => {
            if (!deletedVendor) {
                return res.status(404).json({ message: 'Vendor not found' })
            }
            res.status(200).json({ message: 'Vendor deleted successfully' })
        })
        .catch((err) => res.status(500).json({ error: err.message }))
}


module.exports = vendorController
