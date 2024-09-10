const express = require("express");
const router = express.Router();
const postController = require ("../controllers/post.controller")

router.get("/", postController.getPost);

router.post("/",  postController.sendPost);

router.put("/:id", postController.updatePost);

router.delete("/:id", postController.deletePost);

// router.patch("/like-post/:id", (req,res) => {
//     res.json({message: "le post liké id:" + req.params.id})
// })

// router.patch("/dislike-post/:id", (req,res) => {
//     res.json({message: "le post disliké id:" + req.params.id})
// })


module.exports = router;