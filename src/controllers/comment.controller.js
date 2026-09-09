const {
  getCommentsService,
  getCommentsByPostService,
  createCommentService,
} = require("../services/comment.service")
const { validateCreateComment } = require("../validators/post.validator")

const getCommentsController = async (req, res) => {
  const comments = await getCommentsService()
  res.status(200).json({
    msg: "listado de comments",
    data: comments,
  })
}

const getCommentsByPostController = async (req, res) => {
  const comments = await getCommentsByPostService(req.params.postId)
  res.status(200).json({
    msg: "comments del post",
    data: comments,
  })
}

const createCommentController = async (req, res) => {
  validateCreateComment(req.body)
  const comment = await createCommentService(req.body)
  res.status(201).json({
    msg: "comment creado con exito",
    data: comment,
  })
}

module.exports = {
  getCommentsController,
  getCommentsByPostController,
  createCommentController,
}