const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog'); // Certifique-se que o modelo está correto

const api = supertest(app);

const initialBlogs = [
  {
    title: 'Search blog',
    author: 'Bing',
    url: 'www.bing.com',
    likes: 0,
  },
  {
    title: 'DuckGo',
    author: 'DuckDuckGo',
    url: 'www.duckgo.com',
    likes: 0,
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