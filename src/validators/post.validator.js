const { AppError } = require("../utils/AppError")

const validateCreatePost = (body) => {
  const { title, content, author_id } = body || {}

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new AppError("El campo 'title' es obligatorio", 400)
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new AppError("El campo 'content' es obligatorio", 400)
  }

  if (author_id === undefined || author_id === null || Number.isNaN(Number(author_id))) {
    throw new AppError("El campo 'author_id' es obligatorio y debe ser numerico", 400)
  }
}

const validateUpdatePost = (body) => {
  const { title, content, author_id, published } = body || {}

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    throw new AppError("El campo 'title' no puede estar vacio", 400)
  }

  if (content !== undefined && (typeof content !== "string" || !content.trim())) {
    throw new AppError("El campo 'content' no puede estar vacio", 400)
  }

  if (author_id !== undefined && Number.isNaN(Number(author_id))) {
    throw new AppError("El campo 'author_id' debe ser numerico", 400)
  }

  if (published !== undefined && typeof published !== "boolean") {
    throw new AppError("El campo 'published' debe ser booleano", 400)
  }

  if ([title, content, author_id, published].every((v) => v === undefined)) {
    throw new AppError("Debe enviar al menos un campo para actualizar", 400)
  }
}

const validateCreateComment = (body) => {
  const { content, post_id } = body || {}

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new AppError("El campo 'content' es obligatorio", 400)
  }

  if (post_id === undefined || post_id === null || Number.isNaN(Number(post_id))) {
    throw new AppError("El campo 'post_id' es obligatorio y debe ser numerico", 400)
  }
}

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateCreateComment,
}