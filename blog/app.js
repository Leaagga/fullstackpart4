const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter=require('./controllers/blog')
const mongoose = require('mongoose')
const config=require("./utils/config")
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(()=>console.log('connected to MongoDB'))
    .catch((error)=>console.log('error connecting to MongoDB: ',error.message))

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs',blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)

module.exports = app