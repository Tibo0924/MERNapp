const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const Data = require('./Data')

const API_PORT = 3001
const app = express()
const router = express.Router()

// this is the mongoDB instance
const dbRoute = 'mongodb://Atibi:atibi8992@ds149414.mlab.com:49414/merntest'

// connect the backend to the db instance
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
)

let db = mongoose.connection

db.once('open', () => console.log('Connected to database'))

// check if the connection is successful
db.on('error', () => console.error.bind(console, 'MongoDB connection error'))

// bodyParser parses the request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

// get method fetches all available data in the database

router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true, data: data })
  })
})

// post method overwrites/update existing data
router.post('/updateData', (req, res) => {
  const { id, update } = req.body
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

// delete method, remove an entry from the db
router.delete('/deleteData', (req, res) => {
  const { id } = req.body
  Data.findOneAndDelete(id, err => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

// create method, add new data to the database
router.post('/postData', (req, res) => {
  let data = new Data()

  const { id, message } = req.body

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'Invalid inputs'
    })
  }

  data.message = message
  data.id = id
  data.save(err => {
    if (err) return req.json({ success: false, error: err })
    return res.json({ success: true })
  })
})

app.use('/api', router)

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`))