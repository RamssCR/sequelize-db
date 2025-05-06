import express, { json, urlencoded } from 'express'
import { PORT } from '#configs/env.config.js'
import { cors } from '#middlewares/cors.js'
import parser from 'cookie-parser'
import helmet from 'helmet'
import { router } from '#routes/index.js'

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(parser())
app.use('/api/v1', router)

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))