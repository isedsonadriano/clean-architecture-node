import { DbAddAccount } from "./db-add-account"
import {  Encrypter , AddAccountModel, AccountModel, AddAccountRepository} from "./db-add-account-protocols"

const makeEncryper  = (): Encrypter => {
    class EncryperStub implements Encrypter{
        async encrypt(value:string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncryperStub()
}

const makeFakeAccount = (): AccountModel =>({
    id: "valid_id",
    name: "valid_name",
    email: 'valid_email',
    password: "hashed_password"
})

const makeFakeAccountData = (): AddAccountModel =>({
    name: "valid_name",
    email: 'valid_email',
    password: "hashed_password"
})

const makeAddAccountRepository  = (): AddAccountRepository => {
    class addAccountRepositoryStub implements AddAccountRepository{
        async add(account:AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new addAccountRepositoryStub()
}

const makeSut = (): SutTypes =>{
    const encrypterStub  = makeEncryper()
    const addAccountRepositoryStub  = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

interface SutTypes{
    sut: DbAddAccount
    encrypterStub: Encrypter,
    addAccountRepositoryStub: AddAccountRepository
}

describe('DbAaddAccount UseCase', () => {
    test('Should call Encrypter with correct password', async () =>{
        const {sut, encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
    })

    test('Should throw if encrypter throws ', async () =>{
        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise =  sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should call addAccountRepository with correct values', async () =>{
        const {sut, addAccountRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith(makeFakeAccountData())
    })

    test('Should throw if encrypter throws ', async () =>{
        const {sut, addAccountRepositoryStub} = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise =  sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Should return an account on sucess ', async () =>{
        const {sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    })

})