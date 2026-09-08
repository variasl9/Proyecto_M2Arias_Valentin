const { AppError } = require("../utils/AppError")

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// * valida los datos para crear un author. Lanza AppError(400) si algo falta.
const validateCreateAuthor = (body) => {
  const { name, email } = body || {}

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new AppError("El campo 'name' es obligatorio", 400)
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new AppError("El campo 'email' es obligatorio y debe ser valido", 400)
  }
}

// * valida los datos para actualizar un author (campos opcionales, pero
// * si vienen no pueden ser invalidos)
const validateUpdateAuthor = (body) => {
  const { name, email } = body || {}

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    throw new AppError("El campo 'name' no puede estar vacio", 400)
  }

  if (email !== undefined && (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()))) {
    throw new AppError("El campo 'email' debe ser valido", 400)
  }

  if (name === undefined && email === undefined && body.bio === undefined) {
    throw new AppError("Debe enviar al menos un campo para actualizar", 400)
  }
}

const validateIdParam = (id, resourceName = "recurso") => {
  if (!id || Number.isNaN(Number(id))) {
    throw new AppError(`El id de ${resourceName} debe ser numerico`, 400)
  }
}

module.exports = {
  validateCreateAuthor,
  validateUpdateAuthor,
  validateIdParam,
}