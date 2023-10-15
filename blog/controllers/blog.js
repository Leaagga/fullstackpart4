const blogsRouter = require('express').Router()
const config = require('../utils/config')
const Blog=require('../models/blog')
const User= require('../models/user')
const jwt = require('jsonwebtoken')
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//     console.log(authorization)
//     console.log(authorization.substring(7))
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')){
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/',async (request, response) => {
  const blogs=await Blog.find({}).populate('user',{username:1,name:1,id:1})
  response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  const body=request.body
  const token = request.token
  console.log(request.token)
  const decodedToken = jwt.verify(token,config.SECRET)
    console.log(token)
    console.log(decodedToken)
  if (!decodedToken.id){
    return response.status(401).json({error:'token missing or invalid'})
  }
  
  const user = await User.findById(decodedToken.id)

  console.log(user)
  const blog = new Blog(
    {author:body.author,
    title:body.title,
    url:body.url,
    likes:body.likes,
    user:user._id
  })
  console.log(blog)

  try{
  const savedBlog=await blog.save()
  console.log(savedBlog.id)
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  }catch{
    response.status(400).end()
  }
})
blogsRouter.delete('/:id',async (request,response) => {
  const reqId=request.params.id
  await Blog.findByIdAndRemove(reqId)
  response.status(204).end()
})
blogsRouter.put('/:id',async (request,response) => {
  console.log(request.body)
  response.json(request.params)
  const updatedBlog=await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: request.body.likes },
    { runValidators: true, new: true }
    )
  response.json(updatedBlog.body)
  console.log(updatedBlog)

})
module.exports = blogsRouter