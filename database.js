const mongoose = require('mongoose')
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/e-commerce-mern'

const configureDB = () => {
    mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((error) => {
        console.log('Error connecting to DB', error.message)
    })
}

module.exports = configureDB