// * crear el router principal y montar los sub-routers
const { Router } = require("express")
const { router: authorRouter } = require("./author.routes")
const { router: postRouter } = require("./post.routes")
const { router: commentRouter } = require("./comment.routes")

const router = Router()

router.get("/health", (req, res) => {
  res.status(200).json({ msg: "ok" })
})

router.use("/authors", authorRouter)
router.use("/posts", postRouter)
router.use("/comments", commentRouter)

module.exports = {
  router,
}