const PostModel = require("../models/post.model");
const {updatePost} = require("../controllers/post.controller");


jest.mock("../models/post.model");

describe("Test du middleware updatePost", () => {
    test("test de l'erreur 404", async () => {

        const req = {
            params: { id: "valeur_id" }, // Paramètre de l'ID du post
            auth: { userId: "1234567" }, // ID utilisateur
            file: null,  // Pas de fichier
            body: { message: "message" }, // Corps de la requête
            get: jest.fn().mockReturnValue("localhost")
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


    test("test de l'erreur 403", async () => {
        // Simulez un post trouvé avec un autre auteur que l'utilisateur connecté
        const post = { 
            _id: "valeur_id", 
            author: "another_user_id", // ID différent de celui de req.auth.userId
            message: "Ancien message" 
        };
    
        PostModel.findById.mockResolvedValue(post);  // Simule le post trouvé avec un auteur différent
    
        const req = {
            params: { id: "valeur_id" }, // Paramètre de l'ID du post
            auth: { userId: "1234567" }, // ID utilisateur
            file: null,  // Pas de fichier
            body: { message: "message" }, // Corps de la requête
            get: jest.fn().mockReturnValue("localhost")
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
    
    test("test de la réponse 200", async () => {

        // Définition du nouveau post qui sera renvoyé après mise à jour
        const newPost = {
            id: 1,
            message: "new post",
            author: "author 1",
            comment: []
        };
        
        const req = { 
            file: { imageUrl: '${req.protocol}://${req.get("host")}/images/${req.file.filename}' }, // Correction de l'interpolation
            auth: { userId: "1234567" }, // ID utilisateur
            body: { message: "message" }, // Corps de la requête
            params: { id: "valeur_id" },  // Paramètre de l'ID du post
            get: jest.fn().mockReturnThis("localhost")
            
        };
        // Mock de la méthode findByIdAndUpdate pour retourner un post mis à jour
        PostModel.findById.mockResolvedValue();
    
        
    
        // Simulation de la réponse
        const res = {
            status: jest.fn().mockReturnThis(),  // Mock de la méthode status
            json: jest.fn()                     // Mock de la méthode json
        };

        if (req.file) {
            updatePost.imageUrl = '${req.protocol}://${req.get("host")}/images/${req.file.filename}';
        }
    
        // Appel de la fonction updatePost
        await updatePost(req, res);
        PostModel.findByIdAndUpdate.mockResolvedValue(newPost)
    

    });
    
    test("test de l'erreur 500", async () => {
        const err = new Error("error")
        PostModel.findById.mockRejectedValue(err)

        const req = { 
            file: { imageUrl: '${req.protocol}://${req.get("host")}/images/${req.file.filename}' }, // Correction de l'interpolation
            auth: { userId: "1234567" }, // ID utilisateur
            body: { message: "message" }, // Corps de la requête
            params: { id: "valeur_id" },  // Paramètre de l'ID du post
            get: jest.fn().mockReturnThis("localhost")
        };

        const res = {
            status: jest.fn().mockReturnThis(),  // Mock de la méthode status
            json: jest.fn()                     // Mock de la méthode json
        };

        await updatePost( req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Erreur lors de la tentative de modification du post",
             err: err
        });
    })

        test("test modification updatpost", async () => {
          
          const post = {
            id: 1,
            message: "post",
            author: "1234567",
            comment: []
        };
            const newPost = {
                id: 1,
                message: "new post",
                author: "1234567",
                comment: []
            };
            PostModel.findById.mockResolvedValue(post)
            PostModel.findByIdAndUpdate.mockResolvedValue(newPost);

            const req = { 
                file: { imageUrl: '${req.protocol}://${req.get("host")}/images/${req.file.filename}' }, 
                auth: { userId: "1234567" },
                body: { message: "message" }, // Corps de la requête
                params: { id: "valeur_id" },  // Paramètre de l'ID du post
                get: jest.fn().mockReturnThis("localhost")
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),  // Mock de la méthode status
                json: jest.fn()                     // Mock de la méthode json
            };
           
           await updatePost(req,res);
           
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(newPost);
         
})
    

    test("Test erreur 400", async () => {
        
        const err = new Error ("erreur");

        PostModel.findByIdAndUpdate.mockRejectedValue(err)
        const req = { 
            file: { imageUrl: '${req.protocol}://${req.get("host")}/images/${req.file.filename}' }, 
            auth: { userId: "1234567" },
            body: { message: "message" }, // Corps de la requête
            params: { id: "valeur_id" },  // Paramètre de l'ID du post
            get: jest.fn().mockReturnThis("localhost")
        };

        const res = {
            status : jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        
     await updatePost(req,res)

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            {message: "La modification du post a échoué",
            err: err
            })


    })
})
   