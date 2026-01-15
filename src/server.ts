import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import router from './router.js'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'
import { protect } from './modules/auth.js'
import { createNewUser, signin } from './handlers/user.js'

// Rate limiting configuration
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express();

// Security middleware
app.use(helmet())
app.use(limiter)

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
	res.redirect('/docs');
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', protect, router)

app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
	if (err.type === 'auth') {
		res.status(401).json({message: 'unauthorized'})

	}	else if (err.type === 'input'){
		res.status(400).json({message: 'invalid input'})
		
	} else {
		res.status(500).json({message: 'server error'})
	}
})

export default app

