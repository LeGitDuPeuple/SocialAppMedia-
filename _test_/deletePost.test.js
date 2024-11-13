const PostModel = require("../models/post.model");
const {deletePost} = require("../controllers/post.controller");
const postModel = require("../models/post.model");

jest.mock("../models/post.model");

describe("Test du middleware deletePost", () => {
    test("test de l'erreur 403", async () => {
        
        const req = {
            params : {id: "valeur_id"},
            auth : {userId: "1234567"},
        }

        PostModel.findById.mockResolvedValue(null);

        const res = {
            status: jest.fn().mockReturnThis(),
            json : jest.fn()
        }
 
       await deletePost (req,res);
       expect(res.status).toHaveBeenCalledWith(404);
       expect(res.json).toHaveBeenCalledWith({message: "Post non trouvé"})
        
    })

})

test("test erreur 403", async () => {
    const post = { 
        _id: "valeur_id", 
        author: "author 1", // ID différent de celui de req.auth.userId
        message: "Ancien message" 
    };
    
    PostModel.findById.mockResolvedValue(post);

    const req = {
        params: { id: "valeur_id" }, // Paramètre de l'ID du post
        auth: { userId: "1234567" }, // ID utilisateur
        body: { message: "message" }, // Corps de la requête
        get: jest.fn().mockReturnValue("localhost")
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    await deletePost(req,res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Vous n'êtes pas autorisé à supprimer ce post" });

    
})

test("test de la réponse 200", async () => {
    const post = {
        id: 1,
        message: "post",
        author: "1234567",
        comment: []
    };
    
    PostModel.findById.mockResolvedValue(post); 
    PostModel.findByIdAndDelete.mockResolvedValue(post); 
    
    const req = {
        params: { id: "valeur_id" }, // Paramètre de l'ID du post
        auth: { userId: "1234567" }, // ID utilisateur
        body: { message: "message" }, // Corps de la requête
    };
    const res = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn()
    };

    await deletePost(req, res); 
    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({ message: "Post supprimé", deletPost:post}); 
});


    
test("test de l'erreur 500", async () => {
    const err = new Error ("erreur");
    PostModel.findByIdAndDelete.mockRejectedValue(err);

    const req = {
        params: { id: "valeur_id" }, // Paramètre de l'ID du post
        auth: { userId: "1234567" }, // ID utilisateur
        body: { message: "message" }, // Corps de la requête
    };
    const res = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn()
    };

    await deletePost(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith( { message: "Une erreur s'est produite lors de la suppression du post", err : err })
})

test("erreur 500 2", async () => {
    const err = new Error("erreur");
    PostModel.findById.mockRejectedValue(err);
    
    const req = {
        params: { id: "valeur_id" }, // Paramètre de l'ID du post
        auth: { userId: "1234567" }, // ID utilisateur
        body: { message: "message" }, // Corps de la requête
    };
    const res = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn()
    };

    await deletePost(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de la recherche du post", err: err })

})