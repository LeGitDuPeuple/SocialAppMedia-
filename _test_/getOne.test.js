const PostModel = require("../models/post.model");
const { getOne } = require('../controllers/post.controller'); 


jest.mock('../models/post.model');

describe("Test du middleware getOne", () => {
    
    // Test du statut 200 de "PostModel.findById"
    test("test du statut 200", async () => {
        
        // Mock de l'objet req avec une propriété params
        const req = { params: { id: "valeur_id" } };
        
        // Mock de l'objet res
        const res = {

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // mockResolvedValue sert a simuler une promesse qui réussit
        PostModel.findById.mockResolvedValue(req.params.id);
        
        // Pas besoin de créer un post ici car seul l'id est attendu et il est défini dans req
        // Appel du middleware getPost avec req et res 
        await getOne(req, res);
    
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ post: "valeur_id" });
    });

    // Test de l'erreur 404 qui survient lorsque la condition du middleware est true et que le post n'existe pas
    test("test de l'erreur 404", async () => {

        const req = {
             params: { id: null }
             };

        const res = {

            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Simule une réponse de PostModel.findById avec null
        PostModel.findById.mockResolvedValue(null);
        await getOne(req,res);
        
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Le post n'existe pas" });
        
    });

    // Test de l'erreur 500 lorsqu'une erreur survient pendant la tentative de récupération du post
    test("test de l'erreur 500", async () => {

        const err = new Error("error");


        PostModel.findById.mockRejectedValue(err); 
    
        const req = { params: { id: "valeur_id" } };
        const res = {
            
            status: jest.fn().mockReturnThis(),
            json: jest.fn() 
        };
    
        await getOne(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de la récupération du post", err: err});
    });
});
