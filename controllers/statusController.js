const Status = require('../models/Status')
const statusController = {}

//Create Status
statusController.create = (req, res) => {
    const body = req.body

    Status.findOne({name: body.name, isDelete: true})
    .then((existingStatus) => {
        if(existingStatus){
            existingStatus.isDelete = false
            return existingStatus.save()
        } else {
            const status = new Status(body)
            status.save()
        }
    })
    .then((newStatus) => {res.json('New Status Created ', newStatus)})
    .catch((error) => {res.json('Error creating status ', error.message)})
}

//List all Status
statusController.list = (req, res) => {
    Status.find({isDelete: false})
    .then((status) => {res.json('All Status ', status)})
    .catch((error) => {res.json('Error fetching status ', error.message)})
}

//Show a Status
statusController.show = (req, res) => {
    const id = req.params.id
    Status.findOne({_id: id, isDelete: false})
    .then((status) => {res.json(status)})
    .catch((error) => {res.json(error.message)})
}

//Update a status
statusController.update = (req, res) => {
    const id = req.params.id
    const body = req.body

    Status.findOneAndUpdate({_id: id, isDelete: false}, body, {new: true, runValidators: true})
    .then((status) => {res.json('Status Updated ', status)})
    .catch((error) => {res.json('Error updating status ', error.message)})
}

//Delete Status
statusController.destroy = (req, res) => {
    const id = req.params.id
    Status.findByIdAndUpdate(id, {isDelete: true}, {new: true, runValidators: true})
    .then((status) => {res.json('Status Deleted ', status)})
    .catch((error) => {res.json('Error deleting status ', error.message)})
}

module.exports = statusController