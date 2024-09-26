const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.get("/",auth, commentController.getComment);
router.get("/:id", auth,commentController.getOne);
router.post("/",auth, commentController.PostComment);
router.put("/:id",auth,commentController.updateComment)
router.delete("/:id",auth, commentController.deleteComment);


module.exports = router; 

    


