const Review = require('../models/Review')
const reviewController = {}

//Create review
reviewController.create = (req, res) => {
    const body = req.body
    Review.findOne({rating: body.rating, isDelete: true})
    .populate('userId')
    .populate('productId')
    .then((existingRating) => {
        if(existingRating){
            existingRating.isDelete = false
            return existingRating.save()
        } else {
            const rating = new Review(body)
            rating.save()
        }
    })
    .then(() => {res.json('Review Added')})
    .catch((error) => {res.json(error.message)})
}

//List Reviews
reviewController.list = (req, res) => {
    Review.find({isDelete: false})
    .populate('userId')
    .populate('productId')
    .then((review) => {res.json(review)})
    .catch((error) => {res.json(error.message)})
}

//Show review
reviewController.show = (req, res) => {
    const id = req.params.id
    Review.findOne({_id: id, isDelete: false})
    .populate('userId')
    .populate('productId')
    .then((review) => {res.json(review)})
    .catch((error) => {res.json(error.message)})
}

//Update Review
reviewController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Review.findOneAndUpdate({_id: id, isDelete: false}, body, {new: true, runValidators: true})
    .then((review) => {res.json('Review Updated ', review)})
    .catch((error) => {res.json('Error updating review ', error.message)})
}

//Delete Review
reviewController.destroy = (req, res) => {
    const id = req.params.id
    Review.findByIdAndUpdate(id, {isDelete: true}, {new: true, runValidators: true})
    .then(() => {res.json('Review Deleted')})
    .catch((error) => {res.json('Error Deleting Review ', error.message)})
}

module.exports = reviewController