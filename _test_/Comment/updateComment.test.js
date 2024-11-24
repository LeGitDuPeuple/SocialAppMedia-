const CommentModel = require("../../models/comment.model");
const {updateComment} = require("../../controllers/comment.controller");

// Remplace temporairement le module CommentModel par un mock pour le test.
jest.mock("../../models/comment.model");

describe("test du middleware updateComment", () => {
    
    // Test de l'erreur 400 lorsque le commentaire est introuvable
  test("test de l'erreur 404", async () => {

    const req = {
        params: { id: null }, 
        auth: { userId: "1234567" },  
        body: { message: "message" }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    CommentModel.findByIdAndUpdate.mockResolvedValue(null);

    await updateComment(req,res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Commentaire non trouvé"});

 })
  
 // Test de l'erreur 403 lorsque l'id de l'author du comment et celui de l'utilisateur connecté sont différents
 test("test de l'erreur 403", async () => {

    const comment = { 
        description:"commentaire",
        author:"891011",
        post: "post1"
    };
    const req = {
        params: { id: "valeur_id" }, 
        auth: { userId: "1234567" }, 
    
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    
    CommentModel.findByIdAndUpdate.mockResolvedValue(comment); 

    // Appel de la fonction middleware
    await updateComment(req, res);

    // Vérification du statut 403 et du message
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({message: "vous n'êtes pas autorisé à modifier ce commentaire"});
 })

//  Test du status 200 lors de la réussite de modification du commentiare
 test("test statut 200 (réussite de la modification", async () => {

    const newComment = { 
        author:"1234567",
        description:"commentaire 1",
        post: "1234567"
    };
    const req = {
        params: { id: "valeur_id" }, 
        auth: { userId: "1234567" }, 
    
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    CommentModel.findByIdAndUpdate.mockResolvedValue(newComment);

    await updateComment(req,res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(newComment);
    
 })
 test("tester l'erreur 500 de findByIdAndUpdate", async () => {

    const err = new Error("error");

    const req = {
        params: { id: "valeur_id" }, 
        auth: { userId: "1234567" }, 
    
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    CommentModel.findByIdAndUpdate.mockRejectedValue(err)

    await updateComment(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "La modification du commentaire a échoué", err: err})
 })
})