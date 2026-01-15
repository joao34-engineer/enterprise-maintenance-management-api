import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import router from './router.js'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth.js'
import { createNewUser, signin } from './handlers/user.js'
// Extend Express Request interface to include 'secret'


const app = express();

const customLogger = (message: string)  => (req: Request, res: Response, next: NextFunction) => {
	console.log('hello from my main app', message)
	next()
}

app.use(customLogger('middleware'))
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res, next) => {
	res.json({message: 'hello world'})
})

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

