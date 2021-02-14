import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";
import { ok, serverError } from '../..//presentation/helpers/http-helper'
import { AccountModel } from "../../domain/models/account";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";


const makeFakeRequest = (): HttpRequest =>({ 
  body: {
    name: "any_name",
    email: "valid_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  }
})

const makeFakeAccount = (): AccountModel =>({
  id: "valid_id",
  name: "valid_name",
  email: 'valid_email@mail.com',
  password: "valid_password"
})

const makeServerError = ():HttpResponse =>{
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = ():LogErrorRepository =>{
  
  class LogErrorRepositoryStub implements LogErrorRepository{ 
    async logError(stack:string): Promise<void> {
      return new Promise(resolve => resolve())
    }
    
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller =>{
  class ControllerStub implements Controller{ 
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
    
  }
  return new ControllerStub()
}

const makeSut = ():SutTypes =>{
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe("LogController Decorator", () => {
  
  test("Should call controller handle", async() => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("Should call logErrorRepository  with correct error if returns  a server error", async() => {

    const {sut, controllerStub, logErrorRepositoryStub} = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce( new Promise(resolve => resolve(makeServerError())))

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenLastCalledWith('any_stack')
  })

  test("Should return the same result of the controller logErrorRepository  with correct error if returns  a server error", async() => {
    const {sut} = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

})
