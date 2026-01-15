import prisma from '../db.js'
import { hashPassword, createJWT, comparePassword } from '../modules/auth.js'
 
export const createNewUser = async (req, res, next) => {
  try {  
    const user = await  prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password)
      }
    })
    const token = createJWT(user)
    res.json({ token })

  } catch (e) {
    e.type = 'input'
    next(e)
  }
	

 

}

export const signin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    })

    if (!user) {
      res.status(401)
      res.json({message: 'Invalid username or password'})
      return
    }

    const isValid = await comparePassword(req.body.password, user.password)
    
    if (!isValid) {
      res.status(401)
      res.json({message: 'Invalid username or password'})
      return
    }

    const token = createJWT(user)
    res.json({ token })

  } catch (e) {
    e.type = 'auth'
    next(e)
  }
}
