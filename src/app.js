import express, { json, urlencoded } from 'express'
import { PORT } from '#configs/env.config.js'
import { connectDB } from '#configs/connect.js'
import { cors } from '#middlewares/cors.js'
import { errorHandler } from '#middlewares/errorHandler.js'
import helmet from 'helmet'
import parser from 'cookie-parser'
import { router } from '#routes/index.js'

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(parser())
app.use('/api/v1', router)
app.use(errorHandler)

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running smoothly',
    uptime: process.uptime(),
  })
})

await connectDB()

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))