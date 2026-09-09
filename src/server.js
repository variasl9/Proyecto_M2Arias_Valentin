const path = require("node:path")
const express = require("express")
const YAML = require("yamljs")
const swaggerUi = require("swagger-ui-express")

const { router } = require("./routes")
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler")

const app = express()

// * body parser para JSON
app.use(express.json())

// * documentacion OpenAPI / Swagger UI
const openapiPath = path.join(__dirname, "docs", "openapi.yaml")
const openapiDocument = YAML.load(openapiPath)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument))
app.get("/api-docs.json", (req, res) => {
  res.status(200).json(openapiDocument)
})

// * rutas de la API (authors, posts, comments, health)
app.use(router)

// * 404 para rutas no definidas
app.use(notFoundHandler)

// * middleware global de manejo de errores (siempre al final)
app.use(errorHandler)

module.exports = { app }