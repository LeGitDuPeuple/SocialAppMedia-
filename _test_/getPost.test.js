const PostModel = require('../models/post.model'); 
const { getPost } = require('../controllers/post.controller'); 

// Mock temporairement le module post.model pour les tests.
jest.mock('../models/post.model');

describe("Test du middleware getPost", () => {
  
    // Teste que la fonction getPost retourne un statut 200 en cas de succès lors de la récupération d'un post
    test("répond avec un statut 200", async () => {

        // Simule un tableau contenant 2 posts pour le test.
        const posts = [
            { id: 1, message: "post 1", author: "author 1", comment: [] },
            { id: 2, message: "post 2", author: "author 2", comment: [] }
        ];

        // Simule la méthode `find` pour renvoyer les posts ci-dessus.
        PostModel.find.mockResolvedValue(posts); 

        // Simule une req (il n'y a pas de paramètres spécifiques à ajouter).
        const req = {};
        
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Appelle la fonction getPost avec req et res.
        await getPost(req, res);

        // Vérifie que la fonction a renvoyé le statut 200 (avec le machers), ainsi que la réponse attendu en json
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ post: posts });
    });

    // Teste que la fonction getPost retourne un statut 500 en cas d'erreur lors de la récuperation d'un post
    test("répond avec un statut 500", async () => {
        const err = new Error("error");
    
         // mockckRejectedValue sert a simuler une promesse qui échoue
        PostModel.find.mockRejectedValue(err); 

      
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    
        await getPost(req, res); 

        // Vérifie que la fonction a renvoyé le statut 500 et un message d'erreur.
        expect(res.status).toHaveBeenCalledWith(500); 
        expect(res.json).toHaveBeenCalledWith({message: "Une erreur s'est produite lors de la récupération des post",err: err});
    });
});
