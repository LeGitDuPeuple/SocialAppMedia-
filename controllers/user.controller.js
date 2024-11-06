const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

const UserModel = require("../models/user.model");

module.exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new UserModel({
         pseudo: req.body.pseudo,
          email: req.body.email,
          password: hash,
           role: req.body.role || 'user',
          

        });
        user.save()
          .then(() => res.status(201).json({ message: "Utilisateur créé avec l'adresse suivante  " + req.body.email }))
          .catch(err => res.status(400).json({ err }));
      })
      .catch(err => res.status(500).json({message: "Une erreur s'est produite lors de la création de l'utilisateur", err }));
  };


//   user c'est pour vérifier l'email et valid c'est pour vérifier le mdp

module.exports.login = (req, res) => {
UserModel.findOne({email: req.body.email})
.then(user => {
    if (user === null) {
        // Ici, nous utilisons un message "évasif" pour éviter de révéler si un utilisateur est inscrit ou non. Cela permet de prévenir une fuite de données
        res.status(401).json({message: "Paire identifiant/mdp incorrecte"})
    }else {
        // ici, on met en premier argument la requête que ont envoie, et en second argument, on met le mdp dans la bdd
        bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if(!valid) {
            res.Status(401).json({message: 'paire identifiant/mdp incorrecte'})
        }else {
            res.status(200).json({
                userId: user._id,
                // ici au lieu d'appeler un token ecrit en dure, on appel jwt
                token:jwt.sign(
                    { userId: user._id,userRole: user.role},
                    
                    'RANDOM_TOKEN_SECRET',
                    
                    {expiresIn: "24h"}
                )
            })
        }
      })
      .catch((err) => res.status(500).json({ message :"Une erreur s'est produite pendant la comparaison des mots de passe",err}))
    }
})
.catch((err) => res.status(500).json({ message:"une erreur s'est produite pendant le findOne",err}))




};

module.exports.logout = (req, res) => {
  // Pas de logique serveur réelle, on renvoie juste une confirmation de logout
  res.status(200).json({ message: "Déconnexion réussie" });
}

// c'est une "fausse route", pour effectuer un logout, je vais supprimer le token via le front et rediriger l'utilisateur directement sur la page de connexion une fois le tokken supprimer 