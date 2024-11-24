const CommentModel = require("../../models/comment.model");
const PostModel =require("../../models/post.model");
const {postComment} = require("../../controllers/comment.controller");

// Remplace temporairement le module CommentModel par un mock pour le test.
jest.mock("../../models/comment.model");
jest.mock("../../models/post.model");

describe("Test du middleware postComment", () => {

// Test de l'erreur 400 lorsqu'il n'y a aucune description dans le commentaire
    test("test de l'erreur 400", async () => {
          

         // Mock de l'erreur 
         const err = new Error("error");

         // Mock de l'objet req 
        const req = {
            auth: {userId: "1234567"},
            body: {description: null },
            params: { id: "valeur_id" }
        };

        // Mock de l'objet res
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.create.mockRejectedValue(err);

        await postComment(req,res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message:"Merci d'ajouter une description, l'ID du post et l'ID de l'auteur"});
        

    });
    
    // Test du statut 201 lors de la création d'un commentaire
    test("test de la création d'un commentaire", async () => {

        const createComment = {
            description:"commentaire 1",
            author:"author 1",
            post: "1234567"
       };

       const req = {
           auth: {userId: "1234567"},
           body: {description: "message" },
           params: { id: "valeur_id" },
       };
       const res = {
           status: jest.fn().mockReturnThis(),
           json: jest.fn()
       };

       CommentModel.create.mockResolvedValue(createComment);
       PostModel.findByIdAndUpdate.mockResolvedValue(createComment);

       await postComment(req,res);
       expect(res.status).toHaveBeenCalledWith(201);
       expect(res.json).toHaveBeenCalledWith(createComment);



    });

    // Test de l'erreur 500 lors de la mise à jour du post pour ajouter le commentaire à son tableau
    test("tester l'erreur 500", async () => {
        
        const err = new Error("error");

        const createComment = {
            description:"commentaire 1",
            author:"author 1",
            post: "1234567"
       };

       const req = {
        auth: {userId: "1234567"},
        body: {description: "message" },
        params: { id: "valeur_id" },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Ici, on simule la création du commentaire et la modification du post pour intégrer le commentaire créé
    CommentModel.create.mockResolvedValue(createComment);
    PostModel.findByIdAndUpdate.mockRejectedValue(err);

    await postComment(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur lors de la mise à jour du post", err: err});
    });

    // Test de l'erreur 500 lors de la création d'un commentaire
    test("Test de l'erreur 500",async () => {
        const err = new Error("error");

        const req = {
            auth: {userId: "1234567"},
            body: {description: "message" },
            params: { id: "valeur_id" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        CommentModel.create.mockRejectedValue(err);

        await postComment(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Une erreur s'est produite lors de la création de votre commentaire", err : err});

     
    });
});
