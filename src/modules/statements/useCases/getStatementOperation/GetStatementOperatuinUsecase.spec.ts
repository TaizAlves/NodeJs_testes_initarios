import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementUseCase: GetStatementOperationUseCase;

describe("Get statement Operation", () => {
    beforeEach( async ()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase( inMemoryUsersRepository, inMemoryStatementsRepository);
        getStatementUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be able to get a users's statement position", async ()=> {
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
            amount: 100,
            description: "deposit test" 
        });

        const statement = await getStatementUseCase.execute({
            user_id, 
            statement_id: withdraw.id as string,
        })

        //console.log(statement)
        expect(statement).toEqual(withdraw)
    });

    it("Should not be able to get a statement operation for an inexistent user ", async ()=> {
        expect( async () => {
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
            await getStatementUseCase.execute({
                user_id: "2929292929292",
                statement_id: deposit.id  as string, 
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    })
})