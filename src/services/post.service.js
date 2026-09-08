const { pool } = require("../config/dbConnect")
const { AppError } = require("../utils/AppError")

const getPostsService = async () => {
  const result = await pool.query(
    `SELECT id, author_id, title, content, published, created_at
     FROM posts ORDER BY id ASC`
  )
  return result.rows
}

const getPostByIdService = async (id) => {
  const result = await pool.query(
    `SELECT id, author_id, title, content, published, created_at
     FROM posts WHERE id = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    throw new AppError(`No se encontro un post con id ${id}`, 404)
  }

  return result.rows[0]
}

// * GET /posts/author/:authorId - posts con detalle de su author
const getPostsByAuthorService = async (authorId) => {
  const author = await pool.query(`SELECT id, name, email, bio FROM authors WHERE id = $1`, [
    authorId,
  ])

  if (author.rows.length === 0) {
    throw new AppError(`No se encontro un author con id ${authorId}`, 404)
  }

  const posts = await pool.query(
    `SELECT id, author_id, title, content, published, created_at
     FROM posts WHERE author_id = $1 ORDER BY id ASC`,
    [authorId]
  )

  return {
    author: author.rows[0],
    posts: posts.rows,
  }
}

const createPostService = async ({ title, content, author_id, published }) => {
  // valida que el author exista (FK) antes de insertar, para dar un 404 claro
  const author = await pool.query(`SELECT id FROM authors WHERE id = $1`, [author_id])
  if (author.rows.length === 0) {
    throw new AppError(`No se encontro un author con id ${author_id}`, 404)
  }

  const result = await pool.query(
    `INSERT INTO posts(author_id, title, content, published)
     VALUES ($1, $2, $3, $4)
     RETURNING id, author_id, title, content, published, created_at`,
    [author_id, title.trim(), content.trim(), published ?? false]
  )
  return result.rows[0]
}

const updatePostService = async (id, { title, content, author_id, published }) => {
  await getPostByIdService(id)

  if (author_id !== undefined) {
    const author = await pool.query(`SELECT id FROM authors WHERE id = $1`, [author_id])
    if (author.rows.length === 0) {
      throw new AppError(`No se encontro un author con id ${author_id}`, 404)
    }
  }

  const result = await pool.query(
    `UPDATE posts
     SET title = COALESCE($1, title),
         content = COALESCE($2, content),
         author_id = COALESCE($3, author_id),
         published = COALESCE($4, published)
     WHERE id = $5
     RETURNING id, author_id, title, content, published, created_at`,
    [
      title ? title.trim() : null,
      content ? content.trim() : null,
      author_id ?? null,
      published ?? null,
      id,
    ]
  )
  return result.rows[0]
}

const deletePostService = async (id) => {
  await getPostByIdService(id)
  await pool.query(`DELETE FROM posts WHERE id = $1`, [id])
}

module.exports = {
  getPostsService,
  getPostByIdService,
  getPostsByAuthorService,
  createPostService,
  updatePostService,
  deletePostService,
}