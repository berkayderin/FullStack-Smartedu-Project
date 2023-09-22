const express = require('express')
const mongoose = require('mongoose')

const dotenv = require('dotenv')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const pageRoute = require('./routes/pageRoute')
const courseRoute = require('./routes/courseRoute')
const categoryRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')

dotenv.config()
const app = express()

// template engine
app.set('view engine', 'ejs')

// global variables
global.userIN = null

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
	session({
		secret: 'my_secret_key',
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: process.env.DB_URI })
	})
)

// routes
app.use('*', (req, res, next) => {
	userIN = req.session.userID
	next()
})

app.use('/', pageRoute)
app.use('/courses', courseRoute)
app.use('/categories', categoryRoute)
app.use('/users', userRoute)

app.listen(3000, () => {
	mongoose
		.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.then(() => console.log('Server bağlantısı başarılı!'))
		.catch((err) => console.log('Hata: ', err))
})
