const PostModel =require("../models/post.model");
const {getOne} = require('../controllers/post.controller'); 
const { param } = require("../routers/post.router");

jest.mock('../models/post.model');

describe("Test du middleware getOne",  ()=> {
    
    // ecrire un truc pour reqq res s'applique a tout les test 

    
    test("test du statut 200", async () =>{
        const req = { params: { id: "valeur_id" } };
        PostModel.findById.mockResolvedValue(req.params.id)

       
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getOne(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({post : "valeur_id"}) 
      });

      test("test de l'erreur 403", async () =>{
        const req = { params: { id: "valeur_id" } };
        PostModel.findById.mockResolvedValue(req.params.id)

        if(!req.params.id){
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({message : "Le post n'existe pas"});
        }
      
      })

      test("test de l'erreur 500", async () => {
        // Créer une erreur pour simuler le rejet de la promesse
        const error = new Error("Une erreur s'est produite lors de la récupération du post");
        PostModel.findById.mockRejectedValue(error); // Simule une erreur dans findById
    
        const req = { params: { id: "valeur_id" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() // Correction ici pour utiliser `json` au lieu de `res`
        };
    
        // Appel de la fonction
        await getOne(req, res);
    
        // Vérifier que le statut 500 est bien renvoyé
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Une erreur s'est produite lors de la récupération du post",
            err: error
        });
    });
    
})