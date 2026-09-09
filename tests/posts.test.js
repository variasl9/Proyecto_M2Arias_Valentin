const request = require("supertest")
const { app } = require("../src/server")
const { pool } = require("../src/config/dbConnect")
const { initializeDatabase } = require("../src/config/initDb")

let authorId

beforeAll(async () => {
  await initializeDatabase()
  await pool.query("TRUNCATE TABLE comments, posts, authors RESTART IDENTITY CASCADE")

  // * fixture: un author para poder crear posts asociados
  const { rows } = await pool.query(
    `INSERT INTO authors(name, email) VALUES ($1, $2) RETURNING id`,
    ["Alan Turing", "alan@mail.com"]
  )
  authorId = rows[0].id
})

afterAll(async () => {
  await pool.end()
})

describe("Posts", () => {
  test("POST /posts crea un post correctamente", async () => {
    const res = await request(app).post("/posts").send({
      title: "Mi primer post",
      content: "Contenido de ejemplo",
      author_id: authorId,
      published: true,
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      title: "Mi primer post",
      author_id: authorId,
    })
  })

  test("POST /posts falla con 400 si falta el title", async () => {
    const res = await request(app).post("/posts").send({
      content: "Contenido sin titulo",
      author_id: authorId,
    })

    expect(res.status).toBe(400)
  })

  test("POST /posts falla con 404 si el author_id no existe", async () => {
    const res = await request(app).post("/posts").send({
      title: "Post huerfano",
      content: "Contenido",
      author_id: 9999,
    })

    expect(res.status).toBe(404)
  })

  test("GET /posts/:id responde 404 si el post no existe", async () => {
    const res = await request(app).get("/posts/9999")

    expect(res.status).toBe(404)
  })

  test("GET /posts/author/:authorId devuelve el author con sus posts", async () => {
    const res = await request(app).get(`/posts/author/${authorId}`)

    expect(res.status).toBe(200)
    expect(res.body.data.author.id).toBe(authorId)
    expect(Array.isArray(res.body.data.posts)).toBe(true)
    expect(res.body.data.posts.length).toBeGreaterThan(0)
  })

  test("DELETE /posts/:id elimina el post y luego el GET devuelve 404", async () => {
    const del = await request(app).delete("/posts/1")
    expect(del.status).toBe(204)

    const get = await request(app).get("/posts/1")
    expect(get.status).toBe(404)
  })
})