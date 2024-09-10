const PostModel = require("../models/post.model")

module.exports.getPost = async (req, res) => {
    PostModel.find();
    res.status(200).json(posts);
  };
  
  module.exports.sendPost = async (req, res) => {
    if (!req.body.message) {
      res.status(400).json({ message: "Merci d'ajouter un message" });
    }
  
    PostModel.create({
      ...req.body
    })
    .then((post) => res.status(200).json({post}))
    .catch((err) => res.status(400).json({message: "erreur lors de la récuperation des post", err}))
  };
  
  module.exports.updatePost = async (req, res) => {
      const post = await PostModel.findById(req.params.id)

      if(!post) {
        res.status(400).json({message: "Ce post n'existe pas"});
      }

      PostModel.findByIdAndUpdate(post, req.body, {new:true})

      .then ((post) => res.status(200).json(post))
      .catch((err) => res.status(400).json({message: "La modification du post à échouer", err}))

    }
  

  
    module.exports.deletePost = (req, res) => {
      PostModel.findById(req.params.id)
          .then((post) => {
              if (!post) {
                  return res.status(400).json({ message: "Ce post n'existe pas" });
              }
  
              PostModel.findByIdAndDelete(req.params.id)
                  .then(() => res.status(200).json({ message: "Post supprimé, id : " + req.params.id }))
                  .catch((err) => res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du post", error: err }));
          })
          .catch((err) => res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du post", error: err }));
  };
  