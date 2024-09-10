const express = require("express");
const app = express();
const port = 3000; 
const connectDB = require('./config/database');
const routerPost = require("./routers/post.router");
const routerUser = require("./routers/user.router")
const routerComment= require("./routers/comment.router")

// connexion à la data base 
connectDB();

//permet de traité les donneés de la request
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/post", routerPost);
app.use("/api/auth", routerUser);
app.use("/api/comment", routerComment);


// Sert à faire tourner le back sur le port 3000 de la machine 
app.listen(port, () => {
    console.log(`connexion au port : ${port}`);
    
})