const CommentModel = require("../../models/comment.model");
const PostModel = require("../../models/post.model");
const {deleteComment}= require("../../controllers/comment.controller");

jest.mock("../../models/comment.model");
jest.mock("../../models/post.model");

describe('teste du middlewar deleteComment', () => {

    test("test de l'erreur ", async () => {

        const req = {
            params: { id: "valeur_id" }, 
            auth: { userId: "1234567" }, 
        
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.findById.mockResolvedValue(null);

        await deleteComment(req,res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Commentaire non trouvé" });


    })
 
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
        
        CommentModel.findById.mockResolvedValue(comment);

        await deleteComment(req,res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({  message: "Vous n'êtes pas autorisé à supprimer ce commentaire"})

    })

    test("Test de la réussite de finbyid", async () => {
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
        
        CommentModel.findById.mockResolvedValue(comment);

        await deleteComment(req,res);
        // mise à jour du post sans le commentaire supprimer,
        CommentModel.findByIdAndDelete.mockResolvedValue(comment);
    })

    test("réussite du Post findByIdAndUpdate", async () => {
        const comment = { 
            _id: "valeur_id",
            description: "commentaire",
            author: "1234567", 
            post: "post1" // 
        };
    
        const req = {
            params: { id: "valeur_id" },
            auth: { userId: "1234567" }, 
        };
    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Mock pour CommentModel.findById pour retourner un commentaire valide
        CommentModel.findById.mockResolvedValue(comment);
    
        // Mock pour CommentModel.findByIdAndDelete
        CommentModel.findByIdAndDelete.mockResolvedValue(comment);
    
        // Mock pour PostModel.findByIdAndUpdate
        PostModel.findByIdAndUpdate.mockResolvedValue(true);
    
        await deleteComment(req, res);
    
        // Vérifie si PostModel.findByIdAndUpdate est appelé correctement
        expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "post1", // ID du post lié au commentaire
            { $pull: { comment: "valeur_id" } } // Suppression du commentaire dans le tableau "comment"
        );
    
        // Vérifie que le statut 200 est renvoyé
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Commentaire supprimé" });
    });
    
 test("Erreur 500 lors du findByIdDelete", async () => {

    const comment = { 
        _id: "valeur_id",
        description: "commentaire",
        author: "1234567", 
        post: "post1" // 
    };

    const err = new Error("error");

    const req = {
        params: { id: "valeur_id" },
        auth: { userId: "1234567" }, 
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };


      
        PostModel.findByIdAndUpdate.mockRejectedValue(err);

    await deleteComment(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Une erreur s'est produite lors de la suppression du commentaire ou de la mise à jour du post", err:err});

 })

 test("erreur 500 de findById", async () => {
    const err = new Error("error");

    const req = {
        params: { id: "valeur_id" }, 
        auth: { userId: "1234567" }, 
    
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    
    CommentModel.findById.mockRejectedValue(err);
    await deleteComment(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Une erreur s'est produite lors de la recherche du commentaire", err :err});
    

 })
})