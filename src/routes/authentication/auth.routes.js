import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'

export const authRouter = Router()

// Create an user when registering
authRouter.get('/register')

// Logging into the user's account
authRouter.get('/login')

// Checking the user's profile information
authRouter.get('/profile', validateToken)

// Logging out of the user's account
authRouter.get('/logout', validateToken)