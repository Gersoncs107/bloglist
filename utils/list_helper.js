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
  
}

module.exports = {
  dummy,
  totalLikes
}