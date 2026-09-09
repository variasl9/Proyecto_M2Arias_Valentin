const { Router } = require("express")
const {
  getCommentsController,
  getCommentsByPostController,
  createCommentController,
} = require("../controllers/comment.controller")
const { asyncHandler } = require("../utils/asyncHandler")

const router = Router()

router.get("/post/:postId", asyncHandler(getCommentsByPostController))
router.get("/", asyncHandler(getCommentsController))
router.post("/", asyncHandler(createCommentController))

module.exports = { router }