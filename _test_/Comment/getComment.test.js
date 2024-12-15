const CommentModel = require("../../models/comment.model");
const {getComment} = require("../../controllers/comment.controller");

// Remplace temporairement le module CommentModel par un mock pour le test
jest.mock("../../models/comment.model");

describe("test du middleware GetComment", () => {
    
    // Test de la réponse 200 lorsque la tentative de récupération des commentaires réussit
    test("test réponse 200", async () => {

        // Mock d'un tableau avec deux commentaires
        const comment = [{
            description: "commentaire1",
            author: "author1",
            post: "1234567"
        },
        {
            description: "commentaire2",
            author: "author2",
            post: "12345678"
        }];
        
        // Mock de req avec les propriétés params et auth 
        const req = {
            params: {id: "valeur_id"},
            auth: {userId: "1234567"},
        };
        
        // Mock de res 
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // mockResolvedValue sert à simuler une promesse qui réussit
        CommentModel.find.mockResolvedValue(comment);

        // Appel de getComment avec req et res 
        await getComment(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({comments: comment});
    });

    // Test de l'erreur 500 lorsque la tentative de récupération des commentaires échoue
    test("test de l'erreur 500", async () => {

        // Mock de l'erreur 
        const err = "error";

        const req = {
            params: {id: "valeur_id"},
            auth: {userId: "1234567"},
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.find.mockRejectedValue(err);

        await getComment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de la récupération des commentaires", err: err});
    });

});
