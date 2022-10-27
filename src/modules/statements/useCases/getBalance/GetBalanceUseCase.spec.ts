import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalandeUseCase: GetBalanceUseCase;

describe(" Get balance ", () => {
    beforeEach(async ()=> {
        inMemoryUserRepository= new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase( inMemoryUserRepository );
        inMemoryStatementsRepository= new InMemoryStatementsRepository();
        getBalandeUseCase = new GetBalanceUseCase( inMemoryStatementsRepository, inMemoryUserRepository);
    });

    it("should be able to show user's balance", async () => {
        const user = await createUserUseCase.execute({
            name:"test",
            email: "test@email.com",
            password: "12345",
        })

        const user_id = user.id as string

        const balance = await getBalandeUseCase.execute({user_id});
        //console.log(balance)

        expect(balance).toHaveProperty('statement');
        expect(balance).toHaveProperty("balance");
    })
})