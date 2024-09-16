const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const postController = require ("../controllers/post.controller")

router.get("/", auth, postController.getPost);

router.post("/", auth, postController.sendPost);

router.put("/:id",auth, postController.updatePost);

router.delete("/:id",auth, postController.deletePost);

// router.patch("/like-post/:id", (req,res) => {
//     res.json({message: "le post liké id:" + req.params.id})
// })

// router.patch("/dislike-post/:id", (req,res) => {
//     res.json({message: "le post disliké id:" + req.params.id})
// })


module.exports = router;