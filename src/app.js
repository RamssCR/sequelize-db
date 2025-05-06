import express, { json, urlencoded } from 'express'
import { NODE_ENV, PORT } from '#configs/env.config.js'
import { connectDB } from '#configs/connect.js'
import { cors } from '#middlewares/cors.js'
import helmet from 'helmet'
import parser from 'cookie-parser'
import { router } from '#routes/index.js'

const app = express()

app.use(json())
app.use(urlencoded({ extended: true, limit: NODE_ENV !== 'production' ? '50mb' : '100kb' }))
app.use(cors)
app.use(helmet())
app.use(parser())
app.use('/api/v1', router)

connectDB()

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))