const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog'); // Certifique-se que o modelo está correto

const api = supertest(app);

const initialBlogs = [
  {
    title: 'Primeiro blog',
    author: 'Autor 1',
    url: 'http://primeiro.com',
    likes: 1
  },
  {
    title: 'Segundo blog',
    author: 'Autor 2',
    url: 'http://segundo.com',
    likes: 2
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 20000);

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(2);
});

afterAll(async () => {
  await mongoose.connection.close();
});