require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Blog Working!</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
