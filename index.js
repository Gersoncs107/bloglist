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

app.get('/info', (req, res) => {
    Blog.countDocuments({})
        .then(count => {
            res.send(`
                <div>
                    <h2>The list has info for ${count} blogs</h2>
                    <p>${new Date()}</p>
                </div>
            `)
        })
})


app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.get('/api/blogs/:id', (request, response, next) => {
  Blog.findById(request.params.id).then(blog => {
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

const unknownEndpoint = ((request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
