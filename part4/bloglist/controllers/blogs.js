const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

// Not needed anymore but kept, middleware now used instead
/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}*/


blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.status(200).json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  // new constant to check if the request doesn't have a likes property
  try {
    if(request.body.title === undefined || request.body.url === undefined) {
      return response.status(400).end()
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user
    if(!user){
      return response.status(400).json({ error: 'UserId missing or not valid' })
    }

    const blogData = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes !== undefined ? request.body.likes : 0,
      user: user._id
    }
    const blog = new Blog(blogData)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


// delete method without user auth
/*blogsRouter.delete('/:id', async (request, response, next) => {
  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})*/


// new delete method WITH user auth
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }

    //User fetched by middleware, below method is redundant

    /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({ error: 'token invalid' })
    }*/

    // extracting id from decoded token
    //const userId = decodedToken.id
    const userId = request.user._id

    // blog.user is an Object so it's stringified
    if(blog.user.toString() === userId.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      return response.status(204).end()
    } else {
      return response.status(401).end().json({ error: 'unauthorized to delete this blog' })
    }

  } catch (error) {
    next(error)
  }

})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { likes } = request.body
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    blog.likes = likes
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }

})

module.exports = blogsRouter