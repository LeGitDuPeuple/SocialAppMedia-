const PostModel = require("../models/post.model")

module.exports.getPost = async (req, res) => {
    const posts = await PostModel.find();
    res.status(200).json({posts});
  };
  
  module.exports.sendPost = async (req, res) => {
    if (!req.body.message) {
      res.status(400).json({ message: "Merci d'ajouter un message" });
    }
    else {
  
    PostModel.create({
      ...req.body
    })
    .then((post) => res.status(200).json({post}))
    .catch((err) => res.status(400).json({message: "erreur lors de la récuperation des post", err}))
  }
  };
  
  module.exports.updatePost = async (req, res) => {

    const userId = req.auth.userId; // ID de l'utilisateur connecté, extrait du token JWT
      const post = await PostModel.findById(req.params.id)

      if(!post) {
       return res.status(400).json({message: "Ce post n'existe pas"});
      }
      else if(post.author.toString() !== userId) {
      return res.status(403).json({message:"vous n'êtes pas autorisé à modifier ce post"})
      }
      else {

      PostModel.findByIdAndUpdate(post, req.body, {new:true})

      .then ((post) => res.status(200).json(post))
      .catch((err) => res.status(400).json({message: "La modification du post à échouer", err}))
      }
    }
  

  
    module.exports.deletePost = async (req, res) => {
      const userId = req.auth.userId; // ID de l'utilisateur connecté, extrait du token JWT
    
      PostModel.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
          } 
          else if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
          }
           else {
            // Si le post existe et que l'utilisateur est l'auteur, on le supprime
            return PostModel.findByIdAndDelete(req.params.id)
              .then(() => res.status(200).json({ message: "Post supprimé" }))
              .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));
          }
        })
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", err }));
    };
    