const bcrypt = require("bcrypt");

const UserModel = require("../models/user.model");

module.exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new UserModel({
         pseudo:req.body.pseudo,
          email: req.body.email,
          password: hash,
           role: req.body.role || 'user',
          

        });
        user.save()
          .then(() => res.status(201).json({ message: "Utilisateur créé avec l'adresse suivante  " + req.body.email }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


//   user c'est pour vérifier l'email et valid c'est pour vérifier le mdp

exports.login = (req, res) => {
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
                userId: user.pseudo,
                token:'TOKEN'
            })
        }
      })
      .catch((err) => res.status(500).json({err}))
    }
})
.catch((err) => res.status(500).json({err}))




};