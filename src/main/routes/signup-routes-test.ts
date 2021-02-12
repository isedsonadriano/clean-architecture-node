import request from 'supertest'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper';
import app from '../config/app'

describe('Signup routes', () =>{

    beforeAll(async () => {
      await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
      await MongoHelper.disconnect();
    });

    beforeEach(async () => {
      const accountCollection = MongoHelper.getCollection("accounts");
      await accountCollection.deleteMany({});
    });
      
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