const bcrypt = require('bcrypt')
const usersRouter=require('express').Router()
const User = require('../models/user')

usersRouter.post('/',async (request,response) => {
    const { username, name, password }=request.body
    if (password.length<3){
        return response.status(400).json('password is shorter than the minimum allowed length (3).')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)
    const newUser = new User({
        username:username,
        name:name,
        passwordHash:passwordHash
    })
    
    try{
        const savedUser = await newUser.save()
        response.status(201).json(savedUser)
    }catch(error){
        console.log(error)
        response.status(400).json(error.message)
    }

    
})
usersRouter.get('/',async (request,response) => {
    const user = await User.find({})
    response.json(user)

    
})

module.exports= usersRouter