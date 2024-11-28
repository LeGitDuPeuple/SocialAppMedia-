const UserModel = require("../../models/user.model");
const {signup} = require("../../controllers/user.controller");
const bcrypt = require("bcrypt");

jest.mock("../../models/user.model");
jest.mock("bcrypt");

describe("test du middleware", () => {

    test("réponse 201", async () => {

        // const hash = jest.fn();

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

            // mockReturnThis permet de renvoyé res pour permettre de l'appeler plusieur fois. 
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        bcrypt.hash.mockResolvedValue(true);
        // UserModel.create.mockResolvedValue(newUser);

        await signup(req,res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: "Utilisateur créé avec l'adresse suivante " + req.body.email})
       


    })

    test("test de l'erreur 500 si UserModel.create échoue", async () => {
        const err = new Error("Erreur simulée");
    
        const req = {
            body: {
                pseudo: "pseudo",
                email: "email@test.com",
                password: "plainPassword",
                role: "user",
            },
        };
    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        bcrypt.hash.mockResolvedValue("hashedPassword");
        UserModel.create.mockRejectedValue(err);
    
        await signup(req, res);
    
        // Vérifie que bcrypt.hash est appelé avec les bons arguments
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    
        // Vérifie que UserModel.create est appelé avec les bons arguments
        expect(UserModel.create).toHaveBeenCalledWith({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: "hashedPassword",
            role: req.body.role,
        });
    
        // Vérifie que le statut 500 et le message JSON sont renvoyés
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Une erreur s'est produite lors de la création de l'utilisateur",
            err: err,
        });
    });
    
})