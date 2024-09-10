const commentModel = require("../models/comment.model");
const CommentModel = require("../models/comment.model")

module.exports.getComment = async (req,res) => {
   
     CommentModel.find()
    .then((post) => res.status(200).json(post))
    .catch((err) => res.status(500).json({message: "Une erreur s'est produite lors de la récupération des commentaires", err}))
}

module.exports.PostComment = (req, res) => {
    if (!req.body.description) {
        return res.status(400).json({ message: "Merci d'ajouter un avis" });
    }
      CommentModel.create({
        ...req.body
    })
    .then((post) => res.status(200).json({post}))
    .catch((err) => res.status(500).json({ message: "Une erreur s'est produite lors de la création de votre avis", err }));
};


module.exports.updateComment = async (req, res) => {
    const post = await CommentModel.findById(req.params.id);

    if (!post) {
        return res.status(400).json({ message: "Ce post n'existe pas" });
    }

    CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true })  
        .then((post) => res.status(200).json({ message: "Le post avec l'ID " + req.params.id + " a été mis à jour" }))  
        .catch((err) => res.status(400).json({ message: "La modification du post n'a pas fonctionné", err }));
};




module.exports.deleteComment = (req,res) => {
    return res.status(201).json({message: "delete"})
}

