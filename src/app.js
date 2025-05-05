import express, { json, urlencoded } from 'express'
import { PORT } from '#configs/env.config.js'
import helmet from 'helmet'

const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(helmet())

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))