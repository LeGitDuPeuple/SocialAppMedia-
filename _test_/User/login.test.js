const UserModel = require ("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const {login} = require("../../controllers/user.controller");

jest.mock("../../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe ("test", () => {

    // Test de l'erreur 401 sur les email qui sont null
        test("test erreur 401 ", async () => {
        
            
        const req = 
        {
            body:
            {
             pseudo: "pseudo",
            email: "email",
            password: "hash",
            role: "req.body.role || 'user'"
           }

        }

        const res = {

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        UserModel.findOne.mockResolvedValue(null);

        await login (req,res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({message: "Paire identifiant/mdp incorrecte"});

        

    })


    test("test erreur 401 mdp", async () => {

        const err = new Error("error");

        const req = {
            body: {
                pseudo: "pseudo",
                email: "email@example.com",
                password:"password"
            }
        };
    
        const res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };
    
        bcrypt.compare.mockRejectedValue(err);
    
        await login(req, res);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message:  "Paire identifiant/mdp incorrecte"});
    });

//  test de la réussite de bcrypt.compare
    test("test du status 200", async () => {
  
        const req = 
        {
            body:
            {
             pseudo: "pseudo",
            email: "email",
            password: "hash",
            role: "req.body.role || 'user'"
           },

           userId : "userId"

        }

        const res = {

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        UserModel.findOne.mockResolvedValue(true);
        bcrypt.compare.mockResolvedValue(true);

        await login(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({})

    })

    test("test de l'erreur 500", async () => {
        
        const err = new Error("error");
        const req = 
        {
            body:
            {
             pseudo: "pseudo",
            email: "email",
            password: "hash",
            role: "req.body.role || 'user'"
           },

           userId : "userId"

        }

        const res = {

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        UserModel.findOne.mockResolvedValue(true);
        bcrypt.compare.mockRejectedValue(err);

        await login(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message :"Une erreur s'est produite pendant la comparaison des mots de passe",err:err})
    })
    
    test("Erreur 500 lors de findOne", async () => {
       
       const err = new Error("error");

        const req = 
        {
            body:
            {
             pseudo: "pseudo",
            email: "email",
            password: "hash",
            role: "req.body.role || 'user'"
           },

           userId : "userId"

        }

        const res = {

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        UserModel.findOne.mockRejectedValue(err);
   

        await login(req,res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"une erreur s'est produite pendant le findOne",err:err});
    })
    
    
})