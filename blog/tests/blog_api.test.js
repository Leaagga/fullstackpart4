const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog=require('../models/blog')
const initialTestBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]
describe('test in 4.8',()=>{
beforeEach(async ()=>{
    await Blog.deleteMany({})
    let blogObject = new Blog(initialTestBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialTestBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},100000)
test('test blogs\' number', async () => {
    const response=await api.get('/api/blogs')
    console.log(response.body)
    expect(response.body).toHaveLength(2)
},100000)
afterAll(()=>{
    mongoose.connection.close()
})})
describe('test in 4.9',()=>{
    beforeEach(async ()=>{
    await Blog.deleteMany({})
    let blogObject = new Blog(initialTestBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialTestBlogs[1])
    await blogObject.save()
})
test('check id',async () => {
    const response=await api.get('/api/blogs')
    expect(response.body[1].id).toBeDefined()
})
})
describe('test in 4.10',() => {
    beforeEach(async ()=>{
        await Blog.deleteMany({})
        let blogObject = new Blog(initialTestBlogs[0])
        await blogObject.save()
        blogObject = new Blog(initialTestBlogs[1])
        await blogObject.save()
    })
    test('test http post',async () =>{
        const testBlogObject={
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12
        }
        const initialBloglist= await Blog.find({})
        console.log(initialBloglist)
        const initialLength= initialBloglist.length
        await api
            .post('/api/blogs')
            .send(testBlogObject)
            .expect(201)
            .expect('Content-Type',/application\/json/)
        const response= await api.get('/api/blogs')
        const addedBlogs= response.body.map(r=>r.content)
        console.log(addedBlogs)
        console.log(addedBlogs[1])
        expect(addedBlogs).toHaveLength(initialLength+1)
    },100000)

})