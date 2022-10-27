import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe(" Authenticate User", () => {
    beforeEach( () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase= new CreateUserUseCase(inMemoryUsersRepository );
        authenticateUserUseCase = new AuthenticateUserUseCase( inMemoryUsersRepository );
    })

    it("should be able to authenticate an user session", async ()=> {

        await createUserUseCase.execute({
            name:"test",
            email: "test@email.com",
            password: "12345",
        });

        const response = await authenticateUserUseCase.execute({
            email: "test@email.com",
            password: "12345"
        });

        //console.log(response);

        expect(response).toHaveProperty('token')
    });

    it("should not be able to authenticate inexistent user", async () => {
        expect(async () => {
          await authenticateUserUseCase.execute({
            email: "user@email.com",
            password: "12345",
          });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });
})

