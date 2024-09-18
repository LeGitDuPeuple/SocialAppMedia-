const PostModel = require("../models/post.model")

module.exports.getPost = async (req, res) => {
    const posts = await PostModel.find();
    res.status(200).json({posts});
  };
  
  module.exports.sendPost = async (req, res) => {
    const userId = req.auth.userId;
    if (!req.body.message) {
      res.status(400).json({ message: "Merci d'ajouter un message" });
    }
    else {
  
    return PostModel.create({
      // nouvelle methode avec le spred operator + je pré remplis l'author pour tjr avoir l'id de l'user
      ...req.body,
      author : userId,
    })
    .then((post) => res.status(200).json({post}))
    .catch((err) => res.status(400).json({message: "erreur lors de la récuperation des post", err}))
  }
  };
  
  module.exports.updatePost = (req, res) => {
    const userId = req.auth.userId; // ID de l'utilisateur connecté, extrait du token JWT

    PostModel.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(400).json({ message: "Ce post n'existe pas" });
            } else if (post.author.toString() !== userId) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
            } else {
                return PostModel.findByIdAndUpdate(post._id, req.body, { new: true });
            }
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(400).json({ message: "La modification du post a échoué", err }));
};


  
    module.exports.deletePost =  (req, res) => {
      const userId = req.auth.userId; // ID de l'utilisateur connecté, extrait du token JWT
      // const role = req.user.role;
    
      PostModel.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
          } 
          else if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
          }
          // else if (role == "admin" ){
          //   // || post.author.toString == userId
          //   return PostModel.findByIdAndDelete(req.params.id)
          //     .then(() => res.status(200).json({ message: "Post supprimé" }))
          //     .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));

          // }
           else {
            // Si le post existe et que l'utilisateur est l'auteur, on le supprime
            return PostModel.findByIdAndDelete(req.params.id)
              .then(() => res.status(200).json({ message: "Post supprimé" }))
              .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));
          }
        })
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", err }));
    };
    