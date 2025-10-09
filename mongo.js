require('dotenv').config()
const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD

const url = process.env.TEST_MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', blogSchema)

const note1 = new Note({
  content: 'HTML is Easy',
  important: true,
})

const note2 = new Note({
  content: 'CSS is hard',
  important: false,
})

Promise.all([note1.save(), note2.save()])
  .then(() => {
    console.log('Notas salvas!')
    return Note.find({})
  })
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
