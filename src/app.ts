import express from 'express'
import cors from 'cors'
import { AppRoutes } from './app/app.routes'
import { AuthMiddleware } from './helpers/middlewares/auth-midleware'

export const app = express()
// CONFIGURACIONES PREDEFINIDAS
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/assets', AuthMiddleware.verifyToken, express.static('assets'))
app.use('/api', AppRoutes.routes)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! 🌎',
  })
})
