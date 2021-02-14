import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";
import { serverError } from '../..//presentation/helpers/http-helper'
import { LogErrorRepository } from "../../data/protocols/log-error-repository copy";

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = ():LogErrorRepository =>{
  
  class LogErrorRepositoryStub implements LogErrorRepository{ 
    async log(stack:string): Promise<void> {
      return new Promise(resolve => resolve())
    }
    
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller =>{
  class ControllerStub implements Controller{ 
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse:HttpResponse = {
        statusCode: 200,
        body:{
          name: 'Edson'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
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
    const httpRequest = {
      body:{
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      }
    } 

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
        statusCode: 200,
        body:{
          name: 'Edson'
        }
     })
  })

  test("Should call logErrorRepository  with correct error if returns  a server error", async() => {

    const {sut, controllerStub, logErrorRepositoryStub} = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce( new Promise(resolve => resolve(error)))
    
    const httpRequest = {
      body:{
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      }
    } 

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenLastCalledWith('any_stack')
  })

  test("Should return the same result of the controller logErrorRepository  with correct error if returns  a server error", async() => {

    const {sut} = makeSut()
   
    const httpRequest = {
      body:{
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      }
    } 

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body:{
        name: 'Edson'
      }
    })
  })

})
