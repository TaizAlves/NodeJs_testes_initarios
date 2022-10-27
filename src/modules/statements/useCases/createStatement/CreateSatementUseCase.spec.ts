import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create Statement", () => {
    beforeEach( async () =>{
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository );
    });

    it("should be able to create a new deposit statements", async ()=> {
        const user = await createUserUseCase.execute({
            name:"test",
            email: "test@email.com",
            password: "12345",
        })

        const user_id = user.id as string

        const deposit = await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "deposit test"

        })

        //console.log(deposit);
        expect(deposit.amount).toBe(1000)
        expect(deposit).toHaveProperty("id")
        expect(deposit.description).toEqual("deposit test")
    });

    it("should not be able to make a deposit in an inexistent account", async ()=> {
        expect( async () => {
            await createStatementUseCase.execute({
                user_id : "122929229",
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "deposit test"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("should be able to make a withdraw ", async ()=> {
        const user = await createUserUseCase.execute({
            name:"test",
            email: "test@email.com",
            password: "12345",
        })

        const user_id = user.id as string

        const deposit = await createStatementUseCase.execute({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "deposit test"

        })

        const withdraw = await createStatementUseCase.execute({
            user_id,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "deposit test"

        })
        expect(withdraw).toHaveProperty("id");
        expect(withdraw.amount).toEqual(100);
    });

    it("should not be able to make a transaction with insufficient balance", async ()=> {
        expect( async() =>{
            const user = await createUserUseCase.execute({
                name:"test",
                email: "test@email.com",
                password: "12345",
            })
    
            const user_id = user.id as string
    
            const deposit = await createStatementUseCase.execute({
                user_id,
                type: OperationType.DEPOSIT,
                amount: 500,
                description: "deposit test"
    
            });
    
            const withdraw = await createStatementUseCase.execute({
                user_id,
                type: OperationType.WITHDRAW,
                amount: 800,
                description: "deposit test" 
            });

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    })
})