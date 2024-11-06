const express = require("express");
const auth = require("../middleware/auth")
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.get("/",auth, commentController.getComment);
router.get("/:id", auth,commentController.getOne);
// Je rajoute l'id sur le endpoint du post pour récueprer l'id du tweet lorsque je créer un commentaire 
router.post("/:id",auth, commentController.postComment);
router.put("/:id",auth,commentController.updateComment)
router.delete("/:id",auth, commentController.deleteComment);


module.exports = router; 

    


