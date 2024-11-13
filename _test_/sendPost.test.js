const PostModel = require("../models/post.model");
const {sendPost}= require("../controllers/post.controller");

jest.mock('../models/post.model');

describe("Test du middleware sendPost", () => {

    test("test de l'erreur 403",async () => {
        const error = new Error("Merci d'ajouter un message");
        PostModel.create.mockRejectedValue(error)
        const req = {
             auth: {userId: "1234567"},
             body: {message: "message" }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        
        if(!req.body.message){
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(error);
        }

      
    })

    test("Test du status 200", async () => {
        
        

        const createPost = {
            message: "123456",
            ahthor: "author 1",
            comment: []
        }
        PostModel.create.mockResolvedValue(createPost);

        const req = { 
            file: {imageUrl : '${req.protocol}://${req.get("host")}/images/${req.file.filename}'},
            auth: {userId: "1234567"},
            body: {message: "message" },
            get: jest.fn().mockReturnValue("localhost")
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
     
         if(req.file){
            createPost.imageUrl = '${req.protocol}://${req.get("host")}/images/${req.file.filename}'
         }


        await sendPost (req,res)
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({post: createPost});
    })

    test("Test de l'erreur 500", async () => {
        const error = new Error ("erreur");
      
        
        PostModel.create.mockRejectedValue(error);

        const req = {
            auth: {userId: "1234567"},
            body: {message: "message" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await sendPost(req,res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "erreur lors de la création du post",
            err : error
        })
    });
})