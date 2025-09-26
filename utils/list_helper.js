const dummy = (blogs) => {
  if (Array.isArray(blogs)) {
    return 1
  }
   return undefined
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current))
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorCount = {}
  blogs.forEach(blog => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
  })
  const maxAuthor = Object.keys(authorCount).reduce((a, b) => authorCount[a] > authorCount[b] ? a : b)
  return {
    author: maxAuthor,
    blogs: authorCount[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}