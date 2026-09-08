const { AppError } = require("../utils/AppError")

// * Middleware global de manejo de errores. Debe registrarse al final,
// * despues de todas las rutas.
const errorHandler = (err, req, res, next) => {
  // errores de aplicacion controlados (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      msg: err.message,
    })
  }

  // error de PostgreSQL: violacion de constraint UNIQUE
  if (err.code === "23505") {
    return res.status(400).json({
      msg: "El recurso ya existe (violacion de restriccion unique)",
    })
  }

  // error de PostgreSQL: violacion de foreign key
  if (err.code === "23503") {
    return res.status(400).json({
      msg: "Referencia invalida: el recurso relacionado no existe",
    })
  }

  // error de PostgreSQL: violacion de NOT NULL
  if (err.code === "23502") {
    return res.status(400).json({
      msg: "Falta un campo obligatorio",
    })
  }

  // fallback: error no controlado
  console.error(err)
  return res.status(500).json({
    msg: "Error interno del servidor",
  })
}

// * middleware para rutas no encontradas (404)
const notFoundHandler = (req, res) => {
  res.status(404).json({
    msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  })
}

module.exports = {
  errorHandler,
  notFoundHandler,
}