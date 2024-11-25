import { app } from './app'
import { PORT } from './config/envs.config'

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
