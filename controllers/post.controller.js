const PostModel = require("../models/post.model");



// get de tout les post de la BDD 

module.exports.getPost = (req, res) => {
  return PostModel.find()
      .then(post => res.status(200).json({ post }))
      .catch(err => {
          res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des post", err });
      });
};

// get d'un seul post de la BDD 

  module.exports.getOne =  (req,res) => {
   
    return PostModel.findById(req.params.id) 
    .then( post => {
      if (!post) {
        return res.status(404).json({ message: "Le post n'existe pas" });
      } 
      res.status(200).json({post})
    })
    .catch(err => res.status(500).json({message : "Une erreur s'est produite lors de la récupération du post", err}))
  }


  // créer un post 
  module.exports.sendPost = (req, res) => {
    const userId = req.auth.userId;

    if (!req.body.message) {
        return res.status(400).json({ message: "Merci d'ajouter un message" });
    } else {
        const creatPost = {
            ...req.body,
            author: userId,
        };

        if (req.file) {
            creatPost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }

         PostModel.create(creatPost)
            .then((post) => {
                return res.status(201).json({ post });
            })
            .catch((err) => {
                return res.status(400).json({ message: "Erreur lors de la création du post", err });
            });
    }
};


  
 module.exports.updatePost = (req, res) => {
    const userId = req.auth.userId;

   return PostModel.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: "Ce post n'existe pas" });
            } else if (post.author.toString() !== userId) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
            } else {
              
                const updatePost = { ...req.body };

                if (req.file) {
                    updatePost.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                }
                return PostModel.findByIdAndUpdate(post._id, updatePost, { new: true })
                    .then(updatedPost => res.status(200).json(updatedPost))
                    .catch(err => res.status(400).json({ message: "La modification du post a échoué", err }));
            }
        })
        .catch(err => res.status(500).json({ message: "Erreur lors de la tentative de modification du post", err }));
};


  
    module.exports.deletePost =  (req, res) => {
      const userId = req.auth.userId; 
      const role = req.auth.role;
    
      return PostModel.findById(req.params.id)
        .then(post => {
          if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
          } 
          else if (post.author.toString() !== userId && role !== "admin")  {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
          }
          else {
            return PostModel.findByIdAndDelete(req.params.id)
            .then((deletPost) => res.status(200).json({ message: "Post supprimé", deletPost }))
            .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", err }));

        
          }
        })
        .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", err }));
    };
    