const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter=require('./comtrollers/blog')
const mongoose = require('mongoose')
const config=require("./utils/config")

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(()=>console.log('connected to MongoDB'))
    .catch((error)=>console.log('error connecting to MongoDB: ',error.message))

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogsRouter)
module.exports = app