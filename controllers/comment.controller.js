const CommentModel = require("../models/comment.model");
const PostModel = require("../models/post.model");


module.exports.getComment = (req, res) => {
    CommentModel.find().populate('author').populate('post')
        .then(comments => res.status(200).json({ comments }))
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des commentaires", err }));
};

module.exports.PostComment = (req, res) => {
    if (!req.body.description || !req.body.author || !req.body.post) {
        return res.status(400).json({ message: "Merci d'ajouter une description, l'ID du post et l'ID de l'auteur" });
    } 

    else {
    CommentModel.create({
      ...req.body
    })
    .then(newComment => {
        return PostModel.findByIdAndUpdate(
            req.body.post,
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
    CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedComment => {
            if (!updatedComment) {
                return res.status(404).json({ message: "Commentaire non trouvé" });
            }
            else {
            res.status(200).json(updatedComment);
            }
        })
        .catch(err => res.status(500).json({ message: "La modification du commentaire a échoué", err }));
};


module.exports.deleteComment = (req, res) => {
    CommentModel.findById(req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: "Commentaire non trouvé" });
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
