
const tokenExtractor=(request,response,next)=>{
    const authorization = request.get('authorization')
    console.log(authorization)
    console.log(authorization.substring(7))
    request.token=authorization && authorization.toLowerCase().startsWith('bearer ')? authorization.substring(7): null
    next()

}
module.exports = { tokenExtractor }