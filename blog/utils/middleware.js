const config=require("./config")
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User= require('../models/user')

const userExtractor =async (request, response, next ) =>{
    const authorization = request.get('authorization')
    if (!authorization){
        console.log('token missing')
        return response.status(401).json('token missing')
    }
    console.log(authorization)
    console.log(authorization.substring(7))
    request.token=authorization && authorization.toLowerCase().startsWith('bearer ')? authorization.substring(7): null

    const token = request.token
    try{
        console.log(config.SECRET)
        console.log(process.env.SECRET)

        jwt.verify(token,config.SECRET)

    }catch{
        return response.status(401).json({error:'token missing or invalid'})

    }
    const decodedToken = jwt.verify(token,config.SECRET)
    console.log(decodedToken)
    if (!decodedToken.id){
        return response.status(401).json({error:'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
    request.user=user
    next()

}
module.exports = {  userExtractor }