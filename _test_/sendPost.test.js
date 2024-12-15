const PostModel = require("../models/post.model");
const {sendPost}= require("../controllers/post.controller");

jest.mock('../models/post.model');


describe("Test du middleware sendPost", () => {


    test("test de l'erreur 400",async () => {
         
        // mock de l'erreur 
        const err = new Error("error");

        // mock de l'objet requête avec un message null 
        const req = {
            auth: {userId: "1234567"},
            body: {message: null }
        };
        
        // const de l'objet res
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
    //    mockRejectedValue sert à simuler une promesse qui échoue
        PostModel.create.mockRejectedValue(err);

    //    Appel de la fonction 
        await sendPost(req,res);
       
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Merci d'ajouter un message"});

      
    })

    // Test du status 201 lors de la tentative de création d'un post
    test("Test du status 201", async () => {
        
        
        // mock de l'objet créé
        const createPost = {
            message: "message",
            author: "1234567",
            comment: []
        }

        
        const req = { 
            file: {imageUrl : '${req.protocol}://${req.get("host")}/images/${req.file.filename}'},
            auth: {userId: "1234567"},
            body: {message: "message" },
            // le test ne passe pas si "req.get" sans l'url n'est pas 'mocké'
            get: jest.fn().mockReturnValue("localhost")
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        // mockResolvedValue sert à simuler une promesse qui réussit
        PostModel.create.mockResolvedValue(createPost);

        await sendPost (req,res)
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({post: createPost});
    })

    // Test de l'erreur 500 lors de la tentative de création d'un post 
    test("Test de l'erreur 500", async () => {

        const err = new Error ("erreur");
    
        
        
        const req = {
            auth: {userId: "1234567"},
            body: {message: "message" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        PostModel.create.mockRejectedValue(err);
        await sendPost(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "erreur lors de la création du post", err : err})
    });
})
