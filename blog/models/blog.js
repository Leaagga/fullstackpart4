const mongoose=require('mongoose')
const blogSchema = new mongoose.Schema({
    author:String,
    title: {type:String,required:true},
    url: {type:String,required:true},
    likes: {type:Number, default:0},
    users:{
      type:mongoose.Schema.Types.ObjectId,
      rel:'User'
    }
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Blog', blogSchema)