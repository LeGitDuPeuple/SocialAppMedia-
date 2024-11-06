const PostModel = require('../models/post.model'); 
const { getPost } = require('../controllers/post.controller'); 

// Remplace temporairement le module post.model par un mock pour le test.
jest.mock('../models/post.model');

describe("Test du middleware getPost", () => {
  
    test("test la réponse 200", async () => {
        const posts = [
            { id: 1, message: "post1", author: "author1", comment: [] },
            { id: 2, message: "post2", author: "author2", comment: [] }
        ];

        // Permet de simuler le retour de posts (find)
        PostModel.find.mockResolvedValue(posts); 

        const req = {};
        const res = {
            
 // Simule une fonction qui renvoie l'instance actuelle pour permettre l'enchaînement des méthodes (ex. res.status().json()).
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getPost(req, res);

        // Vérifie que la fonction a été appelée avec des arguments spécifiques.
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ post: posts });
    });

    test("tester la réponse 500", async () => {
        const error = new Error("Une erreur est survenue");
    
        // Permet de simuler le retour d'une erreur
        PostModel.find.mockRejectedValue(error); // Simuler le rejet

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getPost(req, res); // Appeler getPost

        expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le status 500 a été appelé
        expect(res.json).toHaveBeenCalledWith({
            message: "Une erreur s'est produite lors de la récupération des post",
            err: error // Vérifie que l'erreur est correctement passée
        });
    });
});
