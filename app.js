const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const viewRouter = require('./routes/viewRoutes')
const userRouter = require('./routes/userRoutes')
const movementRouter = require('./routes/movementRoutes')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

/* serving static files */
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

/* set security HTTP headers */
app.use(helmet())

/* limiting request from one IP */
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)

/* cross origin resource sharing */
app.use(cors({
   origin: '*',
   methods: ['GET', 'POST'],
   credentials: true
}))
/* app.options('*', cors()) */


/* body parser, reading data from body into req.body */
app.use(express.json({
   limit: '10kb'
}))

/* data sanitization against NoSQL query injection */
app.use(mongoSanitize())

/* data sanitization against XSS */
app.use(xss())

/* prevent parameter pollution */
app.use(hpp({ whitelist: ['movement'] }))

app.use(cookieParser())

/*
app.use((req, res, next) => {
   console.log(req.cookies.jwt)
   next()
})
*/

app.use(compression());

app.use('/', viewRouter)
app.use('/api/users', userRouter)
app.use('/api/movements', movementRouter)

app.get('/', (req, res) => {
   res.status(200).json({
      status: 'success',
      message: 'Server running on port 8000 successfully!'
   })
})

/*
app.all('*', (req, res, next) => {
   next(new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
   ))
})
*/

app.all('*', (req, res) => {
   res.status(200).render('error')
})

app.use(globalErrorHandler);

module.exports = app;