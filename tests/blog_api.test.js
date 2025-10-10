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

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(titles).toContain(
    'Search blog'
  )
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close();
});