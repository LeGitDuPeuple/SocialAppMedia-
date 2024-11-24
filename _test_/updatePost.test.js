const PostModel = require("../models/post.model");
const {updatePost} = require("../controllers/post.controller");


jest.mock("../models/post.model");

describe("Test du middleware updatePost", () => {
   
    // Test de l'erreur 404 lors de la tentative de PostModel.findById pour retrouver un post 
    test("test de l'erreur 404", async () => {

        const req = {
            // l'id est déclaré comme null pour le test
            params: { id:null },
            // obligé de 'mocker' req.auth.userId, sinon le test ne peut pas fonctionner
            auth: { userId: "1234567" }, 
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        PostModel.findById.mockResolvedValue(null);


        // Appel du middleware
        await updatePost(req, res);

        // Vérification de la réponse 404
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Ce post n'existe pas" });
    });

    // Test de l'erreur 403 lorsque l'id de l'author du post et celui de l'utilisateur connecté sont différents
    test("test de l'erreur 403", async () => {

        // Simulez un post trouvé avec un autre auteur différent de l'utilisateur connecté
        const post = { 
            _id: "valeur_id", 
            author: "891011", 
            message: "Ancien message" 
        };
    
        PostModel.findById.mockResolvedValue(post);  
    
        const req = {
            params: { id: "valeur_id" }, 
            auth: { userId: "1234567" }, 
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        // Appel de la fonction middleware
        await updatePost(req, res);
    
        // Vérification du statut 403 et du message
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Vous n'êtes pas autorisé à modifier ce post" });
    });
    
    // Test du statut 200 lors de la réussite de modification du post 
    test("test de la réponse 200", async () => {

        // Définition du nouveau post qui sera renvoyé après mise à jour
        const newPost = {
            id: 1,
            message: "new post",
            author: "author 1",
            comment: []
        };
        
        const req = {  
            auth: { userId: "1234567" }, 
            params: { id: "valeur_id" },  
            
        };

     
        // mockResolvedValue sert à simuler une promesse qui réussit
        PostModel.findById.mockResolvedValue();
    
        
    
        // Simulation de la réponse
        const res = {
            status: jest.fn().mockReturnThis(),  // Mock de la méthode status
            json: jest.fn()                     // Mock de la méthode json
        };

        // Appel de la fonction updatePost
        await updatePost(req, res);

        // Résultat de la réussite de PostModel.findById
        PostModel.findByIdAndUpdate.mockResolvedValue(newPost)
    

    });
    
    // test de l'erreur 500 si la tentative de modification du post échoue 
    test("test de l'erreur 500", async () => {

        const err = new Error("error");

        PostModel.findById.mockRejectedValue(err);

        const req = { 
            auth: { userId: "1234567" }, 
            params: { id: "valeur_id" },  
        };

        const res = {
            status: jest.fn().mockReturnThis(),  
            json: jest.fn()                     
        };

        await updatePost( req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({  message: "Erreur lors de la tentative de modification du post", err: err});
    })

    // Test du statut 201 lorsque la tentative de modification du post réussie 
    test("test modification updatePost", async () => {
          
        // Mock du post initial 
        const post = {
            id: 1,
            message: "post",
            author: "1234567",
            comment: []
        };
        // mock du nouveau post 
        const newPost = {
            id: 1,
            message: "new post",
            author: "1234567",
            comment: []
        };
            
        const req = { 
            auth: { userId: "1234567" },
            params: { id: "valeur_id" },  
        };
    
        const res = {
            status: jest.fn().mockReturnThis(),  
            json: jest.fn()                     
        };

        PostModel.findById.mockResolvedValue(post)
        PostModel.findByIdAndUpdate.mockResolvedValue(newPost);

           
        await updatePost(req,res);
           
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(newPost);
         
    })
    

    // Test de l'erreur 400 lorsque la tentative de modification a échoué (après que PostModel.findById ait réussi)
    test("Test erreur 400", async () => {
        
        const err = new Error ("erreur");

        PostModel.findByIdAndUpdate.mockRejectedValue(err)
        const req = { 
            auth: { userId: "1234567" },
            params: { id: "valeur_id" },  
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        
        await updatePost(req,res)

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            {message: "La modification du post a échoué", err: err})
    })
})
