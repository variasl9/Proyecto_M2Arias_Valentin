const request = require("supertest")
const { app } = require("../src/server")
const { pool } = require("../src/config/dbConnect")
const { initializeDatabase } = require("../src/config/initDb")

let authorId
let postId

beforeAll(async () => {
  await initializeDatabase()
  await pool.query("TRUNCATE TABLE comments, posts, authors RESTART IDENTITY CASCADE")

  // * fixtures: un author y un post para poder crear comments
  const author = await pool.query(
    `INSERT INTO authors(name, email) VALUES ($1, $2) RETURNING id`,
    ["Grace Hopper", "grace@mail.com"]
  )
  authorId = author.rows[0].id

  const post = await pool.query(
    `INSERT INTO posts(author_id, title, content) VALUES ($1, $2, $3) RETURNING id`,
    [authorId, "Post de prueba", "Contenido de prueba"]
  )
  postId = post.rows[0].id
})

afterAll(async () => {
  await pool.end()
})

describe("Comments", () => {
  test("POST /comments crea un comment correctamente", async () => {
    const res = await request(app).post("/comments").send({
      post_id: postId,
      author_id: authorId,
      content: "Excelente post!",
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      post_id: postId,
      content: "Excelente post!",
    })
  })

  test("POST /comments falla con 400 si falta el content", async () => {
    const res = await request(app).post("/comments").send({
      post_id: postId,
    })

    expect(res.status).toBe(400)
  })

  test("POST /comments falla con 404 si el post_id no existe", async () => {
    const res = await request(app).post("/comments").send({
      post_id: 9999,
      content: "Comment huerfano",
    })

    expect(res.status).toBe(404)
  })

  test("GET /comments/post/:postId devuelve los comments del post", async () => {
    const res = await request(app).get(`/comments/post/${postId}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    expect(res.body.data[0].post_id).toBe(postId)
  })
})