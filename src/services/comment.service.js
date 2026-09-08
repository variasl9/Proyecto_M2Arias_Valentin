const { pool } = require("../config/dbConnect")
const { AppError } = require("../utils/AppError")

const getCommentsService = async () => {
  const result = await pool.query(
    `SELECT id, post_id, author_id, content, created_at
     FROM comments ORDER BY id ASC`
  )
  return result.rows
}

// * GET /comments/post/:postId - listar comentarios de un post
const getCommentsByPostService = async (postId) => {
  const post = await pool.query(`SELECT id FROM posts WHERE id = $1`, [postId])
  if (post.rows.length === 0) {
    throw new AppError(`No se encontro un post con id ${postId}`, 404)
  }

  const result = await pool.query(
    `SELECT id, post_id, author_id, content, created_at
     FROM comments WHERE post_id = $1 ORDER BY id ASC`,
    [postId]
  )
  return result.rows
}

const createCommentService = async ({ post_id, author_id, content }) => {
  const post = await pool.query(`SELECT id FROM posts WHERE id = $1`, [post_id])
  if (post.rows.length === 0) {
    throw new AppError(`No se encontro un post con id ${post_id}`, 404)
  }

  if (author_id !== undefined && author_id !== null) {
    const author = await pool.query(`SELECT id FROM authors WHERE id = $1`, [author_id])
    if (author.rows.length === 0) {
      throw new AppError(`No se encontro un author con id ${author_id}`, 404)
    }
  }

  const result = await pool.query(
    `INSERT INTO comments(post_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, author_id, content, created_at`,
    [post_id, author_id ?? null, content.trim()]
  )
  return result.rows[0]
}

module.exports = {
  getCommentsService,
  getCommentsByPostService,
  createCommentService,
}