const request = require("supertest")
const { app } = require("../src/server")
const { pool } = require("../src/config/dbConnect")
const { initializeDatabase } = require("../src/config/initDb")

beforeAll(async () => {
  await initializeDatabase()
  // * arrancamos cada corrida con las tablas vacias, para tener ids predecibles
  await pool.query("TRUNCATE TABLE comments, posts, authors RESTART IDENTITY CASCADE")
})

afterAll(async () => {
  await pool.end()
})

describe("Authors", () => {
  test("POST /authors crea un author correctamente", async () => {
    const res = await request(app).post("/authors").send({
      name: "Ada Lovelace",
      email: "ada@mail.com",
      bio: "Pionera de la programacion",
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@mail.com",
    })
    expect(res.body.data.id).toBeDefined()
  })

  test("POST /authors falla con 400 si falta el name", async () => {
    const res = await request(app).post("/authors").send({
      email: "sinnombre@mail.com",
    })

    expect(res.status).toBe(400)
    expect(res.body.msg).toBeDefined()
  })

  test("POST /authors falla con 400 si el email ya existe", async () => {
    const res = await request(app).post("/authors").send({
      name: "Ada Lovelace 2",
      email: "ada@mail.com", // * mismo email que el primer test
    })

    expect(res.status).toBe(400)
  })

  test("GET /authors/:id responde 404 si el author no existe", async () => {
    const res = await request(app).get("/authors/9999")

    expect(res.status).toBe(404)
    expect(res.body.msg).toMatch(/no se encontro/i)
  })

  test("PUT /authors/:id actualiza el author", async () => {
    const res = await request(app).put("/authors/1").send({
      bio: "Bio actualizada",
    })

    expect(res.status).toBe(200)
    expect(res.body.data.bio).toBe("Bio actualizada")
  })

  test("DELETE /authors/:id elimina el author y luego el GET devuelve 404", async () => {
    const del = await request(app).delete("/authors/1")
    expect(del.status).toBe(204)

    const get = await request(app).get("/authors/1")
    expect(get.status).toBe(404)
  })
})