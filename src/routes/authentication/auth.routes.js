import { Router } from 'express'
import { validateToken } from '#middlewares/validateToken.js'
import { validateSchema } from '#middlewares/validateSchema.js'
import { userSchema } from '#schemas/userSchema.js'
import {
    register,
    login,
    profile,
    logout
} from '#controllers/auth.controller.js'

export const authRouter = Router()

// Create an user when registering
authRouter.get('/register', validateSchema(userSchema), register)

// Logging into the user's account
authRouter.get('/login', validateSchema(userSchema, "partial"), login)

// Checking the user's profile information
authRouter.get('/profile', validateToken, profile)

// Logging out of the user's account
authRouter.get('/logout', validateToken, logout)