const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User= require('../models/user')

const Blog=require('../models/blog')
const usersRouter = require('../controllers/users')
const api = supertest(app)
const initialTestBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
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
const initialUser = [
    {
    name:'aaaaa',
    username:'aaaaa',
    password:'aaaaa'
},{
    name:'bbbbb',
    username:'bbbbb',
    password:'bbbbb'

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
        await User.deleteMany({})
        const response=await api.post('/api/users')
                .send(initialUser[0])


    },1000000)
    test('test http post',async () =>{
        const testBlogObject={
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12
        }
        const initialBloglist= await Blog.find({})
        const initialLength= initialBloglist.length
        // const userObject=await api.get('/api/users')
        // const userList=userObject.body
        // console.log(userObject)
        // console.log(userList)
        // const { username, password }=userList[0]
        // console.log(password)
        const user=await api.post('/api/login')
                .send(
                    {username:"aaaaa",
                    password:"aaaaa"})
        console.log(user)
        const token='bearer '+user.body.token
        console.log(token)
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(testBlogObject)
            .expect(201)
            .expect('Content-Type',/application\/json/)
        const response= await api.get('/api/blogs')
                                .set('Authorization', token)
        const addedBlogs= response.body.map(r=>r.content)
        console.log(addedBlogs)
        console.log(addedBlogs[1])
        expect(addedBlogs).toHaveLength(initialLength+1)
    },100000)

})
describe('test in 4.11',() =>{
    beforeEach(async ()=>{
        await Blog.deleteMany({})
    })
    test('test default likes is 0',async () =>{
        const emptyBlog=await api.get('/api/blogs')
        console.log(emptyBlog.body)
        expect(emptyBlog.body).toHaveLength(0)
        const emptyLikesBLog={
            title: "Empty Likes test",
            author: "TEST TEST TEST",
            url: "http://test/test/test.html"
        }
        await api.post('/api/blogs').send(emptyLikesBLog)
        response=await api.get('/api/blogs')
        console.log(response.body)
        console.log(response.data)
        expect(response.body[0].likes).toEqual(0)

    },100000)
})
describe('test in 4.12',()=>{
    test('400 Bad Request with no title and url',async () =>{
        const noTitleBlog= {
            author: "Empty Title TEST",
            url: "http://test/test/test.html"
        }
        const noUrlBlog={
            title: "Empty Url test",
            author: "TEST TEST TEST"
        }
        await api.post('/api/blogs')
                .send(noTitleBlog)
                .expect(400)
        await api.post('/api/blogs')
                .send(noUrlBlog)
                .expect(400)
    })
})
describe('test in 4.13',() => {
    beforeEach(async () =>{
        await Blog.deleteMany({})
        let blogObject = new Blog(initialTestBlogs[0])
        await blogObject.save()
    })
    test('delete one blog',async () => {
        const initBlogList=await api.get('/api/blogs')
        console.log(initBlogList.body)
        const initBlogNum=initBlogList.body.length
        const initBlogId=initBlogList.body[0].id

        await api.delete(`/api/blogs/${initBlogId}`)
            .expect(204)
        const deletedBlogList=await api.get('/api/blogs')
        expect(deletedBlogList.body).toHaveLength(initBlogNum-1)
    })
})
describe('test in 4.14',() =>{
    beforeEach(async () =>{
        await Blog.deleteMany({})
        await Blog.insertMany(initialTestBlogs)
    },10000)
    test('test update blog\'s likes',async () =>{
        const updateBlogList=await api.get('/api/blogs')
        console.log(updateBlogList.body)
        const newLikes={
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 100
            }
        console.log(newLikes)
        const putId=updateBlogList.body[0].id
        console.log(putId)
        await api.put(`/api/blogs/${putId}`)
                .send(newLikes)
                .expect(200)
        const newBlog=await api.get('/api/blogs')
        console.log(newBlog.body)
        expect(newBlog.body[0].likes).toBe(100)
    },1000000)
})
afterAll(async () => {
   await mongoose.connection.close()
})