const { pool } = require("./dbConnect")

const initializeDatabase = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS authors(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      bio TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts(
      id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      published BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  // * extra credit: comments asociados a posts y authors
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments(
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  const result = await pool.query(`SELECT COUNT(*)::int AS total FROM authors`)
  if (result.rows[0].total === 0) {
    const { rows: authors } = await pool.query(
      `INSERT INTO authors(name, email, bio) VALUES
        ($1, $2, $3),
        ($4, $5, $6)
       RETURNING id`,
      [
        "Ada Lovelace", "ada@mail.com", "Pionera de la programacion",
        "Alan Turing", "alan@mail.com", "Matematico y criptografo",
      ]
    )

    const { rows: posts } = await pool.query(
      `INSERT INTO posts(author_id, title, content, published) VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
       RETURNING id`,
      [
        authors[0].id, "Mi primer post", "Contenido de ejemplo del primer post", true,
        authors[1].id, "Maquinas pensantes", "Contenido de ejemplo sobre computacion", true,
      ]
    )

    await pool.query(
      `INSERT INTO comments(post_id, author_id, content) VALUES
        ($1, $2, $3)`,
      [posts[0].id, authors[1].id, "Excelente post!"]
    )
  }
}

module.exports = {
  initializeDatabase,
}