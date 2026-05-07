const { test, describe, beforeEach } = require('node:test')
//const mongoose = require('mongoose')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
//const { forEach } = require('lodash')
const bcryptjs = require('bcryptjs')

const api = supertest(app)

let token

const initialBlogs = [{
  title: 'How to be a solo',
  author: 'MorganBlackhand',
  url: 'Morgan Blackhand\'s blog on being a solo',
  likes: 82
},
{
  title: 'Cyberpunk 2077',
  author: 'V',
  url: 'Do you even chrome bro?',
  likes: 666
}]

const testUser = {
  'username': 'TestUsername',
  'name': 'test',
  'password': 'test'
}

beforeEach( async() => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await bcryptjs.hash(testUser.password, 10)
  const user = await new User({
    username: testUser.username,
    name: testUser.name,
    passwordHash
  })
  await user.save()
  const userId = user._id

  // Update initialBlogs to include the userId
  const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: userId }))
  await Blog.insertMany(blogsWithUser)
  const authTestToken = (await api.post('/api/login').send({
    'username': 'TestUsername',
    'password': 'test'
  }).expect(200))

  token = authTestToken.body.token
}
)

test('dummy returns 1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('most liked', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]
  test('blog out of blogs list', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })

})


describe('blogs api tests', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)

  })

  test('unique identifier of blogs posts is named id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    response.body.map(blog => {
      assert.strictEqual(blog.id !== undefined, true, 'unique identifier is id')
      assert.strictEqual(blog._id === undefined, true, 'unique identifer is NOT _id')
    })
  }
  )

  test('POST request to the /api/blogs successfully creates a blog post', async () => {
    const content = {
      title: 'Inside the mind of a squirrel',
      author: 'SamK',
      url: 'SamK\'s blog on getting inside the mid of a squirrel',
      likes: 420
    }
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(content).expect(201)
    // responseBody is just the body of response for simplification
    const responseBody = response.body
    // responseContent is responseBody without id parameter for the purposes of this test
    const responseContent = {
      title: responseBody.title,
      author: responseBody.author,
      url: responseBody.url,
      likes: responseBody.likes
    }
    assert.strictEqual((await api.get('/api/blogs')).body.length, initialBlogs.length+1,'total number of blogs in the system is increased by one')
    assert.deepStrictEqual(responseContent, content, 'The correct content is saved to the blog')
  })

  test('likes defaut to 0 if likes property missing from request', async () => {
    const content = {
      title: 'Inside the mind of a squirrel',
      author: 'SamK',
      url: 'SamK\'s blog on getting inside the mid of a squirrel'
    }
    const zeroLikesResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(content)
    assert.strictEqual(zeroLikesResponse.body.likes, 0, 'likes defaut to 0')
  })

  test('if the title or url properties are missing, responds code 400', async () => {
    const content = {
      author: 'SamK',
      likes: 999
    }
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(content)
    assert.strictEqual(response.status, 400, 'Should return 400 Bad Request')
  })

  test('deleting a single blog post resource', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    await api.delete(`/api/blogs/${firstBlog.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const responseAfterDelete = await api.get('/api/blogs')
    assert.strictEqual(responseAfterDelete.body.length, response.body.length -1, 'Should have one less blog')
  })

  test('updating the information of an individual blog post', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    const newLikes = { ...firstBlog, likes: firstBlog.likes + 1 }

    await api.put(`/api/blogs/${firstBlog.id}`).send(newLikes).expect(200)

    const responseAfterUpdate = await api.get('/api/blogs')
    const updatedBlog = responseAfterUpdate.body.find(blog => blog.id === firstBlog.id)
    assert.strictEqual(updatedBlog.likes, newLikes.likes, 'Should have the increased amount of likes')
  })

  test('adding a blog fails if a token is not provided', async () => {
    const content = {
      title: 'Inside the mind of a ZOMBIE',
      author: 'SamK',
      url: 'SamK\'s blog on getting inside the mind of a zombie',
      likes: 86
    }
    await api.post('/api/blogs').send(content).expect(401)
  })
  test('invalid users are NOT created', async () => {
    // Test duplicate username
    const duplicateUser = {
      username: 'TestUsername',
      name: 'test',
      password: 'test'
    }
    const duplicateResponse = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(duplicateResponse.body.error, 'username must be unique')

    // Test missing username
    const noUsername = {
      name: 'test',
      password: 'test'
    }
    const noUsernameResponse = await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(noUsernameResponse.body.error, 'username and password are required')

    // Test short password
    const shortPassword = {
      username: 'NewUser',
      name: 'test',
      password: 'ab'
    }
    const shortPasswordResponse = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(shortPasswordResponse.body.error, 'username and password must be at least 3 characters long')
  })

})