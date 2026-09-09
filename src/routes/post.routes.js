const { Router } = require("express")
const {
  getPostsController,
  getPostByIdController,
  getPostsByAuthorController,
  createPostController,
  updatePostController,
  deletePostController,
} = require("../controllers/post.controller")
const { asyncHandler } = require("../utils/asyncHandler")

const router = Router()

// * ruta especifica antes que /:id para evitar conflictos de matching
router.get("/author/:authorId", asyncHandler(getPostsByAuthorController))

router.get("/", asyncHandler(getPostsController))
router.get("/:id", asyncHandler(getPostByIdController))
router.post("/", asyncHandler(createPostController))
router.put("/:id", asyncHandler(updatePostController))
router.delete("/:id", asyncHandler(deletePostController))

module.exports = { router }
