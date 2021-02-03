import request from 'supertest'
import app from '../config/app'

describe('Signup routes', () =>{
    test('should return and account on success', async () =>{
        
        await request(app)
          .post('/api/signup')
          .send({
              name:'Edson',
              email:'edson@trixti.com.br',
              passoword:'123',
              passwordConfirmation: '123'
          })
          .expect(200)
    })
})