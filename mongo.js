require('dotenv').config()
const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD

const url = process.env.TEST_MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Note', blogSchema)

const blog1 = new Blog({
    title: 'Search blog',
    author: 'Bing',
    url: 'www.bing.com',
    likes: 0,
})

const blog2 = new Blog({
    title: 'DuckGo',
    author: 'DuckDuckGo',
    url: 'www.duckgo.com',
    likes: 0,
})

Promise.all([blog1.save(), blog2.save()])
  .then(() => {
    console.log('Blogs salvos!')
    return Note.find({})
  })
  .then(result => {
    result.forEach(blog => {
      console.log(blog)
    })
    mongoose.connection.close()
  })
