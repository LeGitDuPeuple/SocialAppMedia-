const CommentModel = require("../../models/comment.model");
const {getOne} = require("../../controllers/comment.controller");

// Remplace temporairement le module CommentModel par un mock pour le test.
jest.mock("../../models/comment.model");

describe("Test du middleware", () => {

    // Test de la réponse 200 lorsque la récupération d'un commentaire réussit 
    test("test réponse 201", async () => {

        const req = {
            params: {id: "valeur_id"},
            auth: {userId: "1234567"},
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.findById.mockResolvedValue(req.params.id);
        
        await getOne(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        // Par exemple, le résultat en JSON, c'est jest qui déclare ce qu'il attend
        expect(res.json).toHaveBeenCalledWith({comments: "valeur_id"});
    });

     // Test de la réponse 401 lorsque la récupération d'un commentaire échoue
    test("test de l'erreur 401", async () => {
        // Parfois, il faut aussi mocker des éléments du middleware que le test n'utilise pas. Par exemple ici, jest renvoie une erreur car 'id' n'est pas mocké. Je dois donc le mocker pour pouvoir exécuter le test même si cet élément n'est pas utilisé.

        const err = new Error("Ce commentaire n'existe pas");
        const req = {
            params: {id: "valeur_id"},
            auth: {userId: "1234567"},
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.findById.mockRejectedValue(err);

        await getOne(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message: "Ce commentaire n'existe pas", err: err});
    });
});
