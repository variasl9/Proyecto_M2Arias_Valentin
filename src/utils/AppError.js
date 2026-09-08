// * Error de aplicacion con status code HTTP asociado.
// * Los services lo lanzan (ej: 404 not found, 400 validacion) y el
// * middleware global de errores lo traduce a la respuesta HTTP.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = "AppError"
  }
}

module.exports = { AppError }