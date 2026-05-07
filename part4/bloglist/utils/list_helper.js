const lodash = require('lodash')

const dummy = (blogs) => {
  /*Dummy function*/
  return 1
}

const totalLikes = (blogs) => {

  let totalSum = 0
  blogs.forEach(blog => {
    totalSum+=blog.likes
  })
  return totalSum
}

const favoriteBlog = (blogs) => {
  let totalSum = 0
  let mostLikedBlog = blogs[0]
  blogs.forEach(blog => {
    if (totalSum < blog.likes){
      totalSum = blog.likes
      mostLikedBlog = blog
    }
  })
  return mostLikedBlog
}

const mostBlogs = (blogs) => {

  let count = 0
  let mostBlogsAuthor
  let authorBlogsCount = lodash.countBy( blogs ,'author' )
  let authorBlogsCountSize = lodash.size(authorBlogsCount)

  for(let i = 0; i<authorBlogsCountSize; i++){
    if(lodash.values(authorBlogsCount)[i]>count){
      count = lodash.values(authorBlogsCount)[i]
      mostBlogsAuthor = {
        author:  lodash.keys(authorBlogsCount)[i],
        blogs: lodash.values(authorBlogsCount)[i]
      }
    }
  }

  return mostBlogsAuthor
}

const mostLikes = (blogs) => {
  let likesGroup = lodash.sortBy(blogs, 'author')
  let sizeGroup = lodash.size(blogs)
  let likesArray = []
  let likesId = 0
  let currentAuthor = likesGroup[0].author
  let currentLikes = 0

  for(let i = 0; i<sizeGroup; i++){
    if (likesGroup[i].author === currentAuthor){
      currentLikes += likesGroup[i].likes

    }
    else if (likesGroup[i].author !== currentAuthor){
      likesArray[likesId] = {
        author: currentAuthor,
        likes: currentLikes
      }
      currentAuthor = likesGroup[i].author
      currentLikes = likesGroup[i].likes
      likesId++
    }

  }
  likesArray[likesId] = {
    author: currentAuthor,
    likes: currentLikes
  }
  const mostLiked = lodash.maxBy(likesArray, 'likes')
  return ({
    'author': mostLiked.author,
    'likes' : mostLiked.likes
  })

}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}