import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'

interface CustomError extends Error {
  type?: string;
}

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
} 

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5)
}

export const createJWT = (user) => {
  const token = jwt.sign({
      id: user.id,
      username: user.username

    }, 
    process.env.JWT_SECRET
  )
  return token
}

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization

if (!bearer) {
  const err: CustomError = new Error('Not authorized');
  err.type = 'auth';
  return next(err);
}

 
  const [, token] = bearer.split(' ') 

  if (!token) {
    const err = new Error('Not valid token') as any;
    err.type = 'auth';
    return next(err);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch(e: any) {
    e.type = 'auth';
    next(e);
  }
}
