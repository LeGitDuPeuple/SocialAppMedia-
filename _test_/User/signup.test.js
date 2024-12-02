const UserModel = require("../../models/user.model");
const {signup} = require("../../controllers/user.controller");
const bcrypt = require("bcrypt");

jest.mock("../../models/user.model");
jest.mock("bcrypt");

describe("test du middleware", () => {

    // Test 201 lorsqu'un utilisateur est créer 
    test("réponse 201", async () => {
   
       const newUser = {
        pseudo: "pseudo",
        email: "email",
        password: "hash",
        role: "req.body.role || 'user'"
       }
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
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

         
        bcrypt.hash.mockResolvedValue(true);
        UserModel.create.mockResolvedValue(newUser);
       

        await signup(req,res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: "Utilisateur créé avec l'adresse suivante " + req.body.email});
       


    })

    // Test lorsque la création d'un utilisateur échoue
    test("test de l'erreur 400 ", async () => {
    
        const err = new Error("err");

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
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            
                    
            
            bcrypt.hash.mockResolvedValue(true);
            UserModel.create.mockRejectedValue(err);
           
    
            await signup(req,res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({err:err});
           
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
        }
        
    }
    

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

         
        bcrypt.hash.mockRejectedValue(err);

        await signup(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Une erreur s'est produite lors de la création de l'utilisateur", err:err})
})
})

