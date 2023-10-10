const dummy = (blogs) => {
    return 1


}
const totalLikes = (blogsList) => {
    return blogsList.reduce((acc, bitem) => acc+bitem.likes, 0)
}
const favoriteBlog = (favoriteBlogList)=> {
    return favoriteBlogList.reduce((acc, cur)=>cur.likes>acc.likes?cur:acc,favoriteBlogList[0])
}
module.exports={ dummy,totalLikes,favoriteBlog }