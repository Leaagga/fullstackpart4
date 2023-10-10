const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter=require('./comtrollers/blog')
const mongoose = require('mongoose')
const config=require("./utils/config")




const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogsRouter)


const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})