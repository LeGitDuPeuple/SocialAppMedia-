const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

const UserModel = require("../models/user.model");

module.exports.signup = async (req, res) => {

  return bcrypt.hash(req.body.password, 10)
      .then(hash => {
         return UserModel.create({
              pseudo: req.body.pseudo,
              email: req.body.email,
              password: hash,
              role: req.body.role || 'user',
          })
              .then(() => { res.status(201).json({message: "Utilisateur créé avec l'adresse suivante " + req.body.email});
              })
              .catch(err => res.status(400).json({ err }));
      })
      .catch(err => res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'utilisateur", err }));
};




//   user c'est pour vérifier l'email et valid c'est pour vérifier le mdp

// Middleware de connexion utilisateur
module.exports.login = async (req, res) => {
  return UserModel.findOne({ email: req.body.email })
    .then(user => {
      if (user === null) {
        // Ici, nous utilisons un message "évasif" pour éviter de révéler si un utilisateur est inscrit ou non. Cela permet de prévenir une fuite de données
        return res.status(401).json({ message: "Paire identifiant/mdp incorrecte" });
      } else {
        // Ici, on met en premier argument la requête que l'on envoie, et en second argument, on met le mdp dans la bdd
        return bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'Paire identifiant/mdp incorrecte' });
            } else {
              res.status(200).json({
                userId: user._id,
                // Ici, au lieu d'appeler un token écrit en dur, on appelle jwt
                token: jwt.sign(
                  { userId: user._id, userRole: user.role },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: "24h" }
                )
              });
            }
          })
          .catch((err) => res.status(500).json({ message: "Une erreur s'est produite pendant la comparaison des mots de passe", err }));
      }
    })
    .catch((err) => res.status(500).json({ message: "Une erreur s'est produite pendant le findOne", err }));
};

module.exports.logout = (req, res) => {
  // Pas de logique serveur réelle, on renvoie juste une confirmation de logout
  res.status(200).json({ message: "Déconnexion réussie" });
}

// c'est une "fausse route", pour effectuer un logout, pour ce faire, je vais d'abord mettre le token dans le local storage lors de la connexion. Ensuite, pour effectuer une déconexion, je vais supprimer le token via le front et rediriger l'utilisateur directement sur la page de connexion une fois le token supprimer 