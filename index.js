// * carga las variables de entorno desde .env (nativo de Node, sin dotenv)
try {
  process.loadEnvFile(".env")
} catch (err) {
  // en Railway (u otros entornos) las variables ya vienen seteadas
  // y no hay .env en el filesystem: no es un error fatal.
  console.warn("No se encontro .env, se usan las variables de entorno del sistema.")
}

const { initializeDatabase } = require("./src/config/initDb")
const { app } = require("./src/server")

const PORT = process.env.PORT || 3000

const start = async () => {
  await initializeDatabase()
  app.listen(PORT, () => {
    console.log(`MiniBlog API corriendo en http://localhost:${PORT}`)
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`)
  })
}

start().catch((err) => {
  console.error("Error al iniciar la aplicacion:", err)
  process.exit(1)
})