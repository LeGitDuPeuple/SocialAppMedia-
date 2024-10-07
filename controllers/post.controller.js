const PostModel = require("../models/post.model");
const auth = require("../middleware/auth");

// get de tout les post de la BDD 

module.exports.getPost = (req, res) => {
    PostModel.find()
    .then(post => res.status(200).json({post}))
    .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des post", err }));
  };

  module.exports.getOne = async (req,res) => {
    PostModel.findById(req.params.id) 
    .then( post => res.status(201).json({post}))
    .catch(err => res.status(401).json({message : "Ce post n'existe pas", err}))
  }


  
  module.exports.sendPost =  (req, res) => {
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
   
    const userId = req.auth.userId;
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
        // Rajouter un .catch ici pour la premier promesse 
};


  
    module.exports.deletePost =  (req, res) => {
      const userId = req.auth.userId; // ID de l'utilisateur connecté, extrait du token JWT
      const role = req.auth.role;
    
      PostModel.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
          } 
          else if (post.author.toString() !== userId && role !== "admin")  {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
          }
          else {
            return PostModel.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({ message: "Post supprimé" }))
            .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));

        
          }
        })
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", err }));
    };
    