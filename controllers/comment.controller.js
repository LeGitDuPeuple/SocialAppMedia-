
const CommentModel = require("../models/comment.model");
const PostModel = require("../models/post.model");

// affiché tout les commentaire 
module.exports.getComment = (req, res) => {
    CommentModel.find()
        .then(comments => res.status(200).json({ comments }))
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des commentaires", err }));
};

module.exports.getOne = (req,res) => {
CommentModel.findById(req.params.id)
.then(comments => res.status(201).json({comments}))
.catch(err => res.status(401).json({message: "Ce commentaire n'existe pas", err}))
}

module.exports.PostComment = (req, res) => {
    const userId = req.auth.userId;
    const postId = req.params.id;

    // cette ligne de code veux dire que si la description, l'id dans le token ou l'id du post est vide = erreur 400
    if (!req.body.description) {
        return res.status(400).json({ message: "Merci d'ajouter une description, l'ID du post et l'ID de l'auteur" });
    } 

    else {
    CommentModel.create({

      ...req.body,
      author: userId,
      post: postId
      
    })
    .then(newComment => {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            // le $push est un operateur de mise à jour de mongoDB 
            { $push: { comment: newComment._id } },
            { new: true }
        )
        .then(updatedPost => {
            if (!updatedPost) {
                return res.status(404).json({ message: "Post non trouvé" });
            }
            res.status(201).json(newComment);
        })
        .catch(err => res.status(500).json({ message: "Erreur lors de la mise à jour du post", err }));
    })
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la création de votre commentaire", err }));
};
}


module.exports.updateComment = (req, res) => {
    const userId = req.auth.userId;

    CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedComment => {
            if (!updatedComment) {
                return res.status(404).json({ message: "Commentaire non trouvé" });
            }
            else if(updatedComment.author.toString() !== userId) {
                return res.status(403).json({message: "vous n'êtes pas autorisé à modifier ce commentaire"})
            }
            else {
                 return res.status(200).json(updatedComment);
            }
        })
        .catch(err => res.status(500).json({ message: "La modification du commentaire a échoué", err }));
};


module.exports.deleteComment = (req, res) => {
    const userId = req.auth.userId;
    const role = req.auth.role

    CommentModel.findById(req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: "Commentaire non trouvé" });
            }
            else if(comment.author.toString() !== userId && role !== "admin") {
             return res.status(403).json({message: "Vous n'êtes pas autoriser à modifier ce commentaire"})
            }
             else {
            return CommentModel.findByIdAndDelete(req.params.id)
                .then(() => {
                    // Optionnel : mise à jour du post pour enlever l'ID du commentaire supprimé
                    return PostModel.findByIdAndUpdate(comment.post, { $pull: { comment: req.params.id } })
                        .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
                        .catch(err => res.status(500).json({ message: "Erreur lors de la mise à jour du post", err }));
                })
                .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du commentaire", err }));
            }
        })
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du commentaire", err }));
};
