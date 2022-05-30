const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (error) => {
   console.log('UncaughtException 💥 Shutting Down...')
   console.log(error.name, error.message)

   process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
   useNewUrlParser: true
}).then(() => {
   console.log('DB connection successfull')
})

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})

process.on('unhandledRejection', (error) => {
   console.log('UnhandledRejection 💥 Shutting Down...')
   console.log(error.name, error.message)

   server.close(() => {
      process.exit(1)
   })
})