const express = require("express");
const app = express();
const port = 3000; 
const connectDB = require('./config/database');
const routerPost = require("./routers/post.router");
const routerUser = require("./routers/user.router");
const routerComment= require("./routers/comment.router");
const path = require("path");

// connexion à la data base 
connectDB();

// protection du CORS 
// Ne pas oublier de mettre next car sinon ça ne fonctionne pas.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//permet de traité les donneés de la request et de tansofrmer le JSON en objet js utilisable
app.use(express.json());


app.use("/api/post", routerPost);
app.use("/api/auth", routerUser);
app.use("/api/comment", routerComment);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Sert à faire tourner le back sur le port 3000 de la machine 
app.listen(port, () => {
    console.log(`connexion au port : ${port}`);
    
})