import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showProfileUserUseCase: ShowUserProfileUseCase;

describe("Show user Profile", () => {
    beforeEach( async () => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase( inMemoryUserRepository );
        showProfileUserUseCase = new ShowUserProfileUseCase( inMemoryUserRepository );
    });

    it("should be able to show the user profile", async () => {
        const user= await createUserUseCase.execute({
            name:"test",
            email: "test@email.com",
            password: "12345",
        });

        const id = user.id as string

       //console.log(id)


       const userProfile = await showProfileUserUseCase.execute(id);
       
       //console.log(userProfile)

       expect(userProfile).toHaveProperty("id");
       expect(userProfile.email).toEqual(user.email)

    })

    it("should not be able to show profile if user does not exist", async ()=> {
        expect( async () => {
            const user= await createUserUseCase.execute({
                name:"test",
                email: "test@email.com",
                password: "12345",
            });
    
            await showProfileUserUseCase.execute("9191919191")
        }).rejects.toBeInstanceOf(ShowUserProfileError);

    })
})


