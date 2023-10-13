const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User=require('../models/user')
const initUserList=[
    {user:'aaaa',
    username:'aaaa',
    password:'asdfgh'

}
]
describe('test in 4.16', ()=> {
    beforeEach(async ()=>{
        await User.deleteMany({})
        const initUser=new User(initUserList[0])
        await initUser.save()
    } ,100000)
    test('Not Validation User',async () => {
        const shortUsernameUser={
            user:"bb",
            username:"aa",
            password:'asdf'
        }
        const shortpasswordUser={
            user:"bb",
            username:"aa",
            password:'asdf'
        }
        const notUniqueUser=initUserList[0]
        const currentUser=await User.find({})
        console.log(currentUser)
        await api.post('/api/users')
                .send(shortUsernameUser)
                .expect(400)
        await api.post('/api/users')
                .send(shortpasswordUser)
                .expect(400)
        await api.post('/api/users')
                .send(notUniqueUser)
                .expect(400)
        const testedUser=await User.find({})
        console.log(testedUser)
        expect(testedUser.length).toEqual(currentUser.length)

    },10000)
})