const {
  getPostsService,
  getPostByIdService,
  getPostsByAuthorService,
  createPostService,
  updatePostService,
  deletePostService,
} = require("../services/post.service")
const { validateCreatePost, validateUpdatePost } = require("../validators/post.validator")

const getPostsController = async (req, res) => {
  const posts = await getPostsService()
  res.status(200).json({
    msg: "listado de posts",
    data: posts,
  })
}

const getPostByIdController = async (req, res) => {
  const post = await getPostByIdService(req.params.id)
  res.status(200).json({
    msg: "detalle de post",
    data: post,
  })
}

// * GET /posts/author/:authorId - posts con detalle de su author
const getPostsByAuthorController = async (req, res) => {
  const result = await getPostsByAuthorService(req.params.authorId)
  res.status(200).json({
    msg: "posts del author",
    data: result,
  })
}

const createPostController = async (req, res) => {
  validateCreatePost(req.body)
  const post = await createPostService(req.body)
  res.status(201).json({
    msg: "post creado con exito",
    data: post,
  })
}

const updatePostController = async (req, res) => {
  validateUpdatePost(req.body)
  const post = await updatePostService(req.params.id, req.body)
  res.status(200).json({
    msg: "post actualizado con exito",
    data: post,
  })
}

const deletePostController = async (req, res) => {
  await deletePostService(req.params.id)
  res.status(204).send()
}

module.exports = {
  getPostsController,
  getPostByIdController,
  getPostsByAuthorController,
  createPostController,
  updatePostController,
  deletePostController,
}