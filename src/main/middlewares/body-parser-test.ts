import request from 'supertest'
import app from '../config/app'

describe('bodt parser middleware', () =>{
    test('should parser body as json', async () =>{
        app.post('/', (req, res) =>{
            res.send(req.body)
        })
        await request(app)
          .post('/test_body_parser')
          .send({name:'Edson'})
          .expect({name: 'Edson'})
    })
})