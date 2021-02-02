import { DbAddAccount } from "./db-add-account"

describe('DbAaddAccount UseCase', () => {
    test('Should call Encrypter with correct password', async () =>{
        class EncryperStub{
            async encrypt(value:string): Promise<string>{
                return new Promise(resolve => resolve('hashed_password'))
            }
        }
        const encrypterStub  = new EncryperStub()
        const sut = new DbAddAccount(encrypterStub)
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})