const request = require('supertest')
const app = require('./app')

describe('Claim free share app', () => {
    describe('Happy path', () => {
        it('Should return 200 OK', async () => {
            const res = await request(app)
                .post('/claim-free-share')
                .set('Accept', 'application/json')
                .send({claimedBy: 'ABC'})

            expect(res.statusCode).toBe(200)
        })

        it('Should return json {message, success, tickerSymbol}', async () => {
            const res = await request(app)
                .post('/claim-free-share')
                .set('Accept', 'application/json')
                .send({claimedBy: 'ABC'})
                .expect('Content-Type', /json/)

            expect(res.body).toHaveProperty('success')
            expect(res.body.success).toBe(true)
            expect(res.body).toHaveProperty('tickerSymbol')
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('Invalid path', () => {
        it('Should return 404 Not found', async () => {
            const res = await request(app)
                .post('/invalid-path')
                .set('Accept', 'application/json')

            expect(res.statusCode).toBe(404)
        })
    })

    describe('No claimedBy', () => {
        it('Should return 400 Bad request', async () => {
            const res = await request(app)
                .post('/claim-free-share')
                .set('Accept', 'application/json')
                .send({})

            expect(res.statusCode).toBe(400)
        })

        it('Should return json {message: \'claimedBy required.\', success: false}', async () => {
            const res = await request(app)
                .post('/claim-free-share')
                .set('Accept', 'application/json')
                .send({})
                .expect('Content-Type', /json/)

            expect(res.body).toEqual({message: 'claimedBy required.', success: false})
        })
    })
})
