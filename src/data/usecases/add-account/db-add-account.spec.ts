import { DbAddAccount } from "./db-add-account"
import {  Encryper } from "./db-add-account-protocols"

interface SutTypes{
    sut: DbAddAccount
    encrypterStub: Encryper
}

const makeEncryper  = (): Encryper => {
    class EncryperStub implements Encryper{
        async encrypt(value:string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncryperStub()
}

const makeSut = (): SutTypes =>{
    const encrypterStub  = makeEncryper()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}
describe('DbAaddAccount UseCase', () => {
    test('Should call Encrypter with correct password', async () =>{
        const {sut, encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if encrypter throws ', async () =>{
        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        const promise =  sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
})