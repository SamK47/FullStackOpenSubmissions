const { test, describe, after } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(api)

const something = async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}
console.log('Test1')
console.log(something())