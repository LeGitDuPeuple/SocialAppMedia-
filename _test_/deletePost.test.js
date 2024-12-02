const PostModel = require("../models/post.model");
const {deletePost} = require("../controllers/post.controller");

jest.mock("../models/post.model");

describe("Test du middleware deletePost", () => {

    // Test de l'erreur 404 lorsque le post n'est pas trouvé
    test("test de l'erreur 404", async () => {
        
        // Mock de req
        const req = {
            params: { id: null },
            auth: { userId: "1234567" },
        };

        // Mock de res
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        // mockResolvedValue sert à simuler une promesse qui réussit (avec null)
        PostModel.findById.mockResolvedValue(null);

        // Appel de deletePost
        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Post non trouvé" });
    });

    // Test de l'erreur 403 lorsque l'id de l'author du post et celui de l'utilisateur connecté sont différents
    test("test erreur 403", async () => {
        const post = { 
            _id: "valeur_id", 
            // Il faut un ID différent de celui de req.auth.userId
            author: "890192s",
            message: "Ancien message" 
        };
        
        
        const req = {
            params: { id: "valeur_id" }, 
            auth: { userId: "1234567" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Simule une promesse réussie renvoyant un post
        PostModel.findById.mockResolvedValue(post);

        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Vous n'êtes pas autorisé à supprimer ce post" });
    });

    // Test de la réponse 200 lors de la suppression réussie du post
    test("test de la réponse 200", async () => {
        const post = {
            message: "post",
            author: "1234567",
            comment: []
        };
        
        const req = {
            params: { id: "valeur_id" },
            auth: { userId: "1234567" },
            body: { message: "message" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        PostModel.findById.mockResolvedValue(post); 
        PostModel.findByIdAndDelete.mockResolvedValue(post); 

        await deletePost(req, res); 

        expect(res.status).toHaveBeenCalledWith(200); 
        expect(res.json).toHaveBeenCalledWith({ message: "Post supprimé", deletPost: post }); 
    });

    // Test de l'erreur 500 lorsque la tentative de suppression du post échoue
    test("test de l'erreur 500", async () => {
        const err = new Error("erreur");
        
        PostModel.findByIdAndDelete.mockRejectedValue(err);

        const req = {
            params: { id: "valeur_id" },
            auth: { userId: "1234567" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de la suppression du post", err: err });
    });

    // Test de l'erreur 500 lorsque la tentative de recherche du post échoue
    test("erreur 500 2", async () => {
        const err = new Error("erreur");

        PostModel.findById.mockRejectedValue(err);

        const req = {
            params: { id: "valeur_id" }, 
            auth: { userId: "1234567" } 
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de la recherche du post", err: err });
    });
});
