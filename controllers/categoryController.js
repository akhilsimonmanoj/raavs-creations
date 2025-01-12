const Category = require('../models/Category')
const categoryController = {}

categoryController.create = (req, res) => {
    const body = req.body

    Category.findOne({name: body.name, isDelete: true})
    .then((existingCategory) => {
        if(existingCategory){
            existingCategory.isDelete = false
            return existingCategory.save()
        } else {
            const category = new Category(body)
            category.save()
        }
    })
    .then((newCategory) => {
        res.status(201).json({message: 'Category Created ', category: newCategory})
    })
    .catch((error) => {
        res.status(401).json('Error creating category ', error.message)
    })
}

categoryController.list = (req, res) => {
    Category.find({isDelete: false})
    .then((category) => {
        res.status(201).json('All Categories ', category)
    })
    .catch((error) => {
        res.status(401).json('Error listing categories ', error.message)
    })
}

categoryController.show = (req, res) => {
    const id = req.params.id
    Category.findOne({_id: id, isDelete: false})
    .then((category) => {res.json(category)})
    .catch((error) => {res.json(error.message)})
}

categoryController.update = (req, res) => {
    const body = req.body
    const id = req.params.id
    Category.findOneAndUpdate({_id: id, isDelete: false}, body, {new: true, runValidators: true})
    .then((category) => {res.json(category)})
    .catch((error) => {res.status(401).json(error.message)})
}

categoryController.destroy = (req, res) => {
    const id = req.params.id
    Category.findByIdAndUpdate(id, {isDelete: true}, {new: true, runValidators: true})
    .then(() => {res.json('Category deleted')})
    .catch((error) => {res.json('Error deleting Category ', error.message)})
}

module.exports = categoryController

