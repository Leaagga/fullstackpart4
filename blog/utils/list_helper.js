const dummy = (blogs) => {
    return 1


}
const totalLikes = (blogsList) => {
    return blogsList.reduce((acc, bitem) => acc+bitem.likes, 0)
}
module.exports={ dummy,totalLikes }