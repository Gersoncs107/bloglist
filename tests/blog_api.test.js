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
}, 20000);

describe('when there is initially some blogs saved', () => {
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
})

describe('blog properties', () => {
  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('adding blogs', () => {
  test('a new blog can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Test Author',
      url: 'www.testblog.com',
      likes: 5
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain('New blog');
  });

  test('if likes property is missing from the request, it will default to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'www.nolikes.com'
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test('blog without title and url is not added', async ()=> {
    const newBlog = {
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToDelete = blogsAtStart.body[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const blogsAtEnd = await api.get('/api/blogs');

    expect(blogsAtEnd.body).toHaveLength(
      initialBlogs.length - 1
    )
    const titles = blogsAtEnd.body.map(r => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  })
})

describe('updating a blog', () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs');
    const blogToUpdate = blogsAtStart.body[0]
    const updatedBlogData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(blogToUpdate.likes + 1);
  })
})

afterAll(async () => {
  await mongoose.connection.close();
});