/**
 * * RESPONSABILIDADES DEL CONTROLADOR
 * * 1 - capturar la informacion necesaria para procesar la solicitud - request, params, query, body
 * * 2 - llamar al service que se comunica con la base de datos
 * * 3 - responder al cliente
 */

const {
  getAuthorsService,
  getAuthorByIdService,
  createAuthorService,
  updateAuthorService,
  deleteAuthorService,
} = require("../services/author.service")
const { validateCreateAuthor, validateUpdateAuthor } = require("../validators/author.validator")

const getAuthorsController = async (req, res) => {
  const authors = await getAuthorsService()
  res.status(200).json({
    msg: "listado de authors",
    data: authors,
  })
}

const getAuthorByIdController = async (req, res) => {
  const author = await getAuthorByIdService(req.params.id)
  res.status(200).json({
    msg: "detalle de author",
    data: author,
  })
}

const createAuthorController = async (req, res) => {
  validateCreateAuthor(req.body)
  const author = await createAuthorService(req.body)
  res.status(201).json({
    msg: "author creado con exito",
    data: author,
  })
}

const updateAuthorController = async (req, res) => {
  validateUpdateAuthor(req.body)
  const author = await updateAuthorService(req.params.id, req.body)
  res.status(200).json({
    msg: "author actualizado con exito",
    data: author,
  })
}

const deleteAuthorController = async (req, res) => {
  await deleteAuthorService(req.params.id)
  res.status(204).send()
}

module.exports = {
  getAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController,
}