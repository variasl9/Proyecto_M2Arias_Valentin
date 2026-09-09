const { Router } = require("express")
const {
  getAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController,
} = require("../controllers/author.controller")
const { asyncHandler } = require("../utils/asyncHandler")

const router = Router()

router.get("/", asyncHandler(getAuthorsController))
router.get("/:id", asyncHandler(getAuthorByIdController))
router.post("/", asyncHandler(createAuthorController))
router.put("/:id", asyncHandler(updateAuthorController))
router.delete("/:id", asyncHandler(deleteAuthorController))

module.exports = { router }