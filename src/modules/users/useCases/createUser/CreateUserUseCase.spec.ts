import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", ()=> {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase( inMemoryUserRepository );
    });

    it("should be able to create a new users", async () => {
        const user = {
            name: "Mozi",
            email: "mozi@email.com",
            password: "1234"
        }

        const createdUser = await createUserUseCase.execute({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        //console.log(createdUser);
        expect(createdUser).toHaveProperty("id");    
    });

    it("should not be able to create a new users with the same email", async () => {
        expect( async () => {
            const user = {
                name: "Name 1",
                email: "user@email.com",
                password: "1234"
            }
    
            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password,
            });
    
            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password,
            });

        }).rejects.toBeInstanceOf(CreateUserError);
 
    });

})