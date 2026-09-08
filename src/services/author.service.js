const { pool } = require("../config/dbConnect")
const { AppError } = require("../utils/AppError")

const getAuthorsService = async () => {
  const result = await pool.query(
    `SELECT id, name, email, bio, created_at FROM authors ORDER BY id ASC`
  )
  return result.rows
}

const getAuthorByIdService = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, bio, created_at FROM authors WHERE id = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    throw new AppError(`No se encontro un author con id ${id}`, 404)
  }

  return result.rows[0]
}

const createAuthorService = async ({ name, email, bio }) => {
  const result = await pool.query(
    `INSERT INTO authors(name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, bio, created_at`,
    [name.trim(), email.trim().toLowerCase(), bio || null]
  )
  return result.rows[0]
}

const updateAuthorService = async (id, { name, email, bio }) => {
  // aseguramos que el author existe (lanza 404 si no)
  await getAuthorByIdService(id)

  const result = await pool.query(
    `UPDATE authors
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         bio = COALESCE($3, bio)
     WHERE id = $4
     RETURNING id, name, email, bio, created_at`,
    [name ? name.trim() : null, email ? email.trim().toLowerCase() : null, bio ?? null, id]
  )
  return result.rows[0]
}

const deleteAuthorService = async (id) => {
  // aseguramos que el author existe (lanza 404 si no)
  await getAuthorByIdService(id)

  await pool.query(`DELETE FROM authors WHERE id = $1`, [id])
}

module.exports = {
  getAuthorsService,
  getAuthorByIdService,
  createAuthorService,
  updateAuthorService,
  deleteAuthorService,
}