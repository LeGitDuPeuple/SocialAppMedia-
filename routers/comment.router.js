const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.get("/", commentController.getComment);
router.post("/", commentController.PostComment);
router.put("/:id",commentController.updateComment)
router.delete("/:id", commentController.deleteComment);


module.exports = router; 

    


