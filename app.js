const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const configureDB = require('./database')
const routes = require('./routes')
const port = process.env.PORT || 5000

configureDB()

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', routes)

app.listen(port, () => {
    console.log('Server listening to port', port)
})