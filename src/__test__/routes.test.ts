import app from '../server'
import supertest from 'supertest'

/**
 * GridOps API Routes Tests
 * Basic smoke tests for API endpoints
 */

describe('GridOps API Routes', () => {
    
    describe('GET /', () => {
        it('should send back welcome message', async () => {
            const res = await supertest(app).get('/')

            expect(res.body.message).toBe('hello world')
            expect(res.status).toBe(200)
        })
    })

    describe('Authentication Routes', () => {
        it('POST /user - should accept user creation requests', async () => {
            const res = await supertest(app)
                .post('/user')
                .send({ username: `test_${Date.now()}`, password: 'password123' })

            // Log response for debugging
            if (res.status !== 200) {
                console.log('User creation failed:', res.status, res.body)
            }

            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })

        it('POST /signin - should accept signin requests', async () => {
            // Create user first
            const username = `signin_test_${Date.now()}`
            await supertest(app)
                .post('/user')
                .send({ username, password: 'testpass' })

            // Then sign in
            const res = await supertest(app)
                .post('/signin')
                .send({ username, password: 'testpass' })

            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })
    })

    describe('Protected Routes - No Auth', () => {
        it('GET /api/asset - should reject without token', async () => {
            const res = await supertest(app).get('/api/asset')
            expect(res.status).toBe(401)
        })

        it('GET /api/maintenance - should reject without token', async () => {
            const res = await supertest(app).get('/api/maintenance')
            expect(res.status).toBe(401)
        })

        it('GET /api/task - should reject without token', async () => {
            const res = await supertest(app).get('/api/task')
            expect(res.status).toBe(401)
        })
    })
})