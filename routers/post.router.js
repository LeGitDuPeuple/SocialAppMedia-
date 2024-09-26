const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const postController = require ("../controllers/post.controller")

router.get("/", auth, postController.getPost);
router.get("/:id",auth, postController.getOne)
router.post("/", auth, postController.sendPost);
router.put("/:id",auth, postController.updatePost);
router.delete("/:id",auth, postController.deletePost);


module.exports = router;