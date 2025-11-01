// controllers/users.js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // 1. Verificar se username e password foram fornecidos
  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required'
    })
  }

  // 2. Verificar comprimento mínimo
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long'
    })
  }

  // 3. Verificar se username já existe
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  // 4. Hash da senha
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // 5. Criar usuário
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter