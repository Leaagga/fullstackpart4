const blogsRouter = require('express').Router()
const Blog=require('../models/blog')
const User= require('../models/user')
blogsRouter.get('/',async (request, response) => {
  const blogs=await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  const blog = new Blog(request.body)
  const user = await User.findById(blog.userId)
  try{
  const savedBlog=await blog.save()
  user.notes=user.notes.concat(savedBlog.id)
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